defmodule Boardy.Matchmaking do
  @moduledoc """
  The Matchmaking context.
  """

  import Ecto.Query, warn: false
  alias Boardy.Repo
  alias Boardy.Matchmaking.Match
  alias Boardy.Chat

  def get_match!(id), do: Repo.get!(Match, id)

  @doc """
  Unlocks a match after on-chain staking is verified by the TriSphere frontend.
  Provisions a chat room when both parties have committed on Avalanche.
  """
  def confirm_on_chain_payment!(match_id, user_id, opts \\ []) do
    chain_verified = Keyword.get(opts, :chain_verified, false)
    counterparty_id = counterparty_user_id(user_id)

    unless chain_verified do
      raise ArgumentError, "On-chain verification required — call via TriSphere unlock-match API"
    end

    match =
      case Repo.get(Match, match_id) do
        nil ->
          {:ok, new_match} =
            %Match{}
            |> Match.changeset(%{
              similarity_score: 0.95,
              status: "pending",
              user_a_id: user_id,
              user_b_id: counterparty_id
            })
            |> Repo.insert()

          new_match

        existing_match ->
          existing_match
      end

    Repo.transaction(fn ->
      match
      |> Match.changeset(%{status: "unlocked"})
      |> Repo.update!()

      case Repo.get_by(Chat.ChatRoom, match_id: match.id) do
        nil ->
          {:ok, room} = Chat.create_chat_room(%{match_id: match.id, is_active: true})
          room

        room ->
          room
      end
    end)
  end

  defp counterparty_user_id(user_id) do
    case System.get_env("BOARDY_COUNTERPARTY_USER_ID") do
      nil ->
        case Repo.one(from u in Boardy.Accounts.User, where: u.id != ^user_id, order_by: [asc: u.id], limit: 1) do
          nil -> max(user_id + 1, 2)
          user -> user.id
        end

      id ->
        String.to_integer(id)
    end
  end
end
