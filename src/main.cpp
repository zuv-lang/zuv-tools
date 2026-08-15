#include "LSP.h"
#include <iostream>

int main(int argc, char** argv) {
    std::cout << "Starting Standalone Zuv Language Server (zuv-lsp v1.0)...\n";
    return LSP::runServer();
}
