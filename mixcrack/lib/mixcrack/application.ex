defmodule Mixcrack.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      MixcrackWeb.Telemetry,
      # Start the Ecto repository
      Mixcrack.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Mixcrack.PubSub},
      # Start Finch
      {Finch, name: Mixcrack.Finch},
      # Start the Endpoint (http/https)
      MixcrackWeb.Endpoint
      # Start a worker by calling: Mixcrack.Worker.start_link(arg)
      # {Mixcrack.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Mixcrack.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    MixcrackWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
