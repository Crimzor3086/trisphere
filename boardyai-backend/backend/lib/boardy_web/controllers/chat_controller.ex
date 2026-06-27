defmodule BoardyWeb.ChatController do
  use BoardyWeb, :controller

  alias Boardy.Chat

  def list_messages(conn, %{"id" => room_id}) do
    messages =
      room_id
      |> Chat.list_messages_for_room()
      |> Enum.map(&message_json/1)

    json(conn, %{messages: messages})
  end

  def create_message(conn, %{"id" => room_id} = params) do
    content = Map.get(params, "content")
    sender_id = Map.get(params, "sender_id")

    if is_nil(content) or content == "" or is_nil(sender_id) do
      conn
      |> put_status(:bad_request)
      |> json(%{error: "content and sender_id required"})
    else
      case Chat.create_message(%{
             content: content,
             sender_id: sender_id,
             chat_room_id: room_id
           }) do
        {:ok, message} ->
          json(conn, message_json(message))

        {:error, _changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> json(%{error: "Could not save message"})
      end
    end
  end

  defp message_json(message) do
    %{
      id: message.id,
      type: "text",
      content: message.content,
      sender_id: message.sender_id,
      inserted_at: DateTime.to_iso8601(message.inserted_at)
    }
  end
end
