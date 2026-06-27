defmodule BoardyWeb.MatchController do
  use BoardyWeb, :controller

  alias Boardy.Matchmaking

  def confirm_payment(conn, %{"id" => id, "user_id" => user_id} = params) do
    chain_verified = Map.get(params, "chain_verified") in [true, "true"]

    case Matchmaking.confirm_on_chain_payment!(id, user_id, chain_verified: chain_verified) do
      {:ok, chat_room} ->
        conn
        |> put_status(:ok)
        |> json(%{
          success: true,
          message: "Match unlocked on Avalanche",
          chat_room_id: chat_room.id
        })

      {:error, _reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Failed to unlock match"})
    end
  end
end
