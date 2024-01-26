defmodule Mixcrack.Repo do
  use Ecto.Repo,
    otp_app: :mixcrack,
    adapter: Ecto.Adapters.Postgres
end
