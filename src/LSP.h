#ifndef ZUV_LSP_H
#define ZUV_LSP_H

#include <string>
#include <vector>

class LSP {
public:
    static int runServer();
private:
    static void handleInitialize(const std::string& id);
    static void handleHover(const std::string& id, const std::string& params);
    static void handleCompletion(const std::string& id);
    static void sendResponse(const std::string& jsonBody);
};

#endif // ZUV_LSP_H
