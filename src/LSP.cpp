#include "LSP.h"
#include <iostream>
#include <string>
#include <vector>
#include <sstream>

void LSP::sendResponse(const std::string& jsonBody) {
    std::cout << "Content-Length: " << jsonBody.length() << "\r\n\r\n" << jsonBody << std::flush;
}

void LSP::handleInitialize(const std::string& id) {
    std::string res = "{\"jsonrpc\":\"2.0\",\"id\":" + id + ",\"result\":{\"capabilities\":{\"hoverProvider\":true,\"completionProvider\":{}}}}";
    sendResponse(res);
}

int LSP::runServer() {
    std::cerr << "[zuv-lsp] Server started over stdio\n";
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.rfind("Content-Length:", 0) == 0) {
            int len = std::stoi(line.substr(15));
            std::string emptyLine;
            std::getline(std::cin, emptyLine); // consume \r
            std::vector<char> buf(len + 1, 0);
            std::cin.read(buf.data(), len);
            std::string req(buf.data());
            
            size_t idPos = req.find("\"id\":");
            std::string id = "1";
            if (idPos != std::string::npos) {
                size_t endPos = req.find_first_of(",}", idPos);
                id = req.substr(idPos + 5, endPos - (idPos + 5));
            }

            if (req.find("\"method\":\"initialize\"") != std::string::npos) {
                handleInitialize(id);
            } else if (req.find("\"method\":\"shutdown\"") != std::string::npos) {
                sendResponse("{\"jsonrpc\":\"2.0\",\"id\":" + id + ",\"result\":null}");
                break;
            }
        }
    }
    return 0;
}
