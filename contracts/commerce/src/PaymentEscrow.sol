// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {TriSphereTreasury} from "./TriSphereTreasury.sol";
import {TriSphereReputation} from "./TriSphereReputation.sol";

/// @title PaymentEscrow — USDC milestone escrow with platform fee + reputation updates
contract PaymentEscrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Status {
        Created,
        Funded,
        MilestoneApproved,
        Released,
        Refunded,
        Cancelled
    }

    struct Escrow {
        address payer;
        address payee;
        address token;
        uint256 amount;
        string description;
        Status status;
    }

    TriSphereTreasury public immutable treasury;
    TriSphereReputation public immutable reputation;
    uint256 public platformFeeBps;
    uint256 public nextId;

    mapping(uint256 => Escrow) public escrows;

    bytes32 private constant METRIC_PAYMENTS = keccak256("PAYMENTS_COMPLETED");
    bytes32 private constant METRIC_ESCROWS = keccak256("ESCROWS_FUNDED");

    event EscrowCreated(uint256 indexed id, address indexed payer, address indexed payee, uint256 amount);
    event EscrowFunded(uint256 indexed id, address indexed payer, uint256 amount);
    event MilestoneApproved(uint256 indexed id, address indexed payer);
    event FundsReleased(uint256 indexed id, address indexed payee, uint256 payeeAmount, uint256 feeAmount);
    event EscrowRefunded(uint256 indexed id, address indexed payer, uint256 amount);
    event EscrowCancelled(uint256 indexed id);

    error InvalidAddress();
    error InvalidAmount();
    error InvalidStatus(Status current, Status required);
    error NotParticipant(address caller);

    constructor(TriSphereTreasury _treasury, TriSphereReputation _reputation, uint256 _platformFeeBps) {
        if (address(_treasury) == address(0) || address(_reputation) == address(0)) revert InvalidAddress();
        treasury = _treasury;
        reputation = _reputation;
        platformFeeBps = _platformFeeBps;
    }

    function createEscrow(
        address payee,
        address token,
        uint256 amount,
        string calldata description
    ) external returns (uint256 id) {
        if (payee == address(0) || token == address(0) || msg.sender == payee) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();

        id = nextId++;
        escrows[id] = Escrow({
            payer: msg.sender,
            payee: payee,
            token: token,
            amount: amount,
            description: description,
            status: Status.Created
        });

        emit EscrowCreated(id, msg.sender, payee, amount);
    }

    function fundEscrow(uint256 id) external nonReentrant {
        Escrow storage e = escrows[id];
        if (msg.sender != e.payer) revert NotParticipant(msg.sender);
        if (e.status != Status.Created) revert InvalidStatus(e.status, Status.Created);

        IERC20(e.token).safeTransferFrom(msg.sender, address(this), e.amount);
        e.status = Status.Funded;

        reputation.record(e.payer, METRIC_ESCROWS, 1);
        emit EscrowFunded(id, msg.sender, e.amount);
    }

    function approveMilestone(uint256 id) external {
        Escrow storage e = escrows[id];
        if (msg.sender != e.payer) revert NotParticipant(msg.sender);
        if (e.status != Status.Funded) revert InvalidStatus(e.status, Status.Funded);

        e.status = Status.MilestoneApproved;
        emit MilestoneApproved(id, msg.sender);
    }

    function releaseFunds(uint256 id) external nonReentrant {
        Escrow storage e = escrows[id];
        if (msg.sender != e.payer) revert NotParticipant(msg.sender);
        if (e.status != Status.MilestoneApproved) revert InvalidStatus(e.status, Status.MilestoneApproved);

        e.status = Status.Released;
        uint256 fee = (e.amount * platformFeeBps) / 10_000;
        uint256 payeeAmount = e.amount - fee;

        IERC20 token = IERC20(e.token);
        token.safeTransfer(e.payee, payeeAmount);
        if (fee > 0) {
            token.forceApprove(address(treasury), fee);
            treasury.depositFee(e.token, fee, bytes32(uint256(id)));
        }

        reputation.record(e.payee, METRIC_PAYMENTS, 5);
        reputation.record(e.payer, METRIC_PAYMENTS, 2);

        emit FundsReleased(id, e.payee, payeeAmount, fee);
    }

    function refund(uint256 id) external nonReentrant {
        Escrow storage e = escrows[id];
        if (msg.sender != e.payer) revert NotParticipant(msg.sender);
        if (e.status != Status.Funded && e.status != Status.MilestoneApproved) {
            revert InvalidStatus(e.status, Status.Funded);
        }

        e.status = Status.Refunded;
        IERC20(e.token).safeTransfer(e.payer, e.amount);
        emit EscrowRefunded(id, e.payer, e.amount);
    }

    function cancel(uint256 id) external {
        Escrow storage e = escrows[id];
        if (msg.sender != e.payer) revert NotParticipant(msg.sender);
        if (e.status != Status.Created) revert InvalidStatus(e.status, Status.Created);

        e.status = Status.Cancelled;
        emit EscrowCancelled(id);
    }
}
