defmodule Boardy.AI do
  @doc """
  Calls Gemini to generate a real pgvector embedding.
  Pads the 768-dimensional Gemini vector to 1536 dimensions so we don't have to alter the database schema.
  """
  def generate_embedding(text) do
    api_key = System.get_env("GEMINI_API_KEY") || ""
    
    if is_nil(api_key) or api_key == "" do
      IO.puts("WARNING: GEMINI_API_KEY is not set. Cannot generate real vectors.")
      {:error, :missing_api_key}
    else
      url = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=#{api_key}"
      
      body = %{
        model: "models/text-embedding-004",
        content: %{
          parts: [%{text: text}]
        }
      }
      
      case Req.post(url, json: body) do
        {:ok, %Req.Response{status: 200, body: data}} ->
          embedding = data["embedding"]["values"]
          
          # Gemini returns 768 dimensions. Our DB is strictly 1536 dimensions.
          # We pad it with exactly 768 zeros. Cosine similarity math still works perfectly.
          padded_embedding = embedding ++ List.duplicate(0.0, 768)
          
          {:ok, Pgvector.new(padded_embedding)}
          
        error ->
          IO.inspect(error, label: "GEMINI_ERROR")
          {:error, "Failed to generate embedding"}
      end
    end
  end

  @doc """
  Calls Gemini 1.5 Flash to intelligently extract the user's Offer and Need from the raw transcript.
  """
  def extract_summary(transcript) do
    api_key = System.get_env("GEMINI_API_KEY") || ""
    
    if is_nil(api_key) or api_key == "" do
      {:error, :missing_api_key}
    else
      url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=#{api_key}"
      
      prompt = "You are an expert AI matchmaker. Read the following conversation between an AI and a User. Extract two things from the user's perspective: 1. Their 'Offer' (What they are building, their skills, what they bring to the table). 2. Their 'Need' (What they are looking for, who they want to meet). Return ONLY a JSON object in this exact format: {\"offer\": \"...\", \"need\": \"...\"}. Keep them concise (1-2 sentences each). Conversation: #{transcript}"

      body = %{
        contents: [%{parts: [%{text: prompt}]}]
      }
      
      case Req.post(url, json: body) do
        {:ok, %Req.Response{status: 200, body: data}} ->
          try do
            text_response = data["candidates"] |> hd() |> get_in(["content", "parts"]) |> hd() |> Map.get("text")
            
            # Strip markdown code blocks if Gemini returns them
            clean_json = String.replace(text_response, ~r/```json|```/, "") |> String.trim()
            parsed = Jason.decode!(clean_json)
            {:ok, parsed["offer"], parsed["need"]}
          rescue
            _ -> {:error, "Failed to parse JSON"}
          end
        error ->
          IO.inspect(error, label: "GEMINI_SUMMARY_ERROR")
          {:error, "Failed to call Gemini"}
      end
    end
  end
end
