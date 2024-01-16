{
  description = "A basic gomod2nix flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";

    # gomod2nix.url = "github:nix-community/gomod2nix";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    (flake-utils.lib.eachDefaultSystem (system:
      let
        src = ./src;
        pkgs = import nixpkgs { inherit system; };

        nodejs = pkgs.nodejs-18_x;
        nodePackageManager = pkgs.nodePackages.pnpm;

        python = pkgs.python310;
        pythonProjectName = "processor";
        pythonProjectDir = ./src./processor;
        pythonOverrides = pkgs.poetry2nix.overrides.withDefaults (final: prev:
          {
            # Python dependency overrides go here
          });

      in {

        packages.${pythonProjectName} = pkgs.poetry2nix.mkPoetryApplication {
          inherit python pythonProjectDir pythonOverrides;
          propogatedBuildInputs = [ ];
        };

        packages.frontend = pkgs.stdenv.mkDerivation rec {
          name = "fe";
          dontUnpack = true;
          src = ./src/fe;
          buildInputs = with pkgs; [
            nodejs-18_x
            nodePackages.pnpm
            jq
            nodePackages.uglify-js
          ];
          ESBUILD_BINARY_PATH = "${pkgs.esbuild}/bin/esbuild";

          buildPhase = ''
            runHook preBuild
            shopt -s dotglob

            rm -fr deps/${name}/node_modules
            mkdir -pv deps/${name}/node_modules
            pushd deps/${name}/node_modules
            ln -s ../../../node_modules/* .
            popd
            pnpm --offline build
            runHook postBuild
          '';
          installPhase = ''
            runHook preInstall

            mv deps/${name}/build $out

            runHook postInstall
          '';
        };

        defaultPackage = self.packages.${system}.frontend;
        devShells.default = import ./shell.nix { inherit pkgs; };
      }));
}

