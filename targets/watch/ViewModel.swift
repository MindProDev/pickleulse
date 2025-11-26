import SwiftUI
import WatchConnectivity

class ViewModel: NSObject, ObservableObject, WCSessionDelegate {
    @Published var scoreA = 0
    @Published var scoreB = 0
    @Published var server = "team_a" // "team_a" or "team_b"
    
    override init() {
        super.init()
        if WCSession.isSupported() {
            let session = WCSession.default
            session.delegate = self
            session.activate()
        }
    }
    
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        // Handle activation
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        DispatchQueue.main.async {
            if let newScoreA = message["scoreA"] as? Int {
                self.scoreA = newScoreA
            }
            if let newScoreB = message["scoreB"] as? Int {
                self.scoreB = newScoreB
            }
            if let newServer = message["server"] as? String {
                self.server = newServer
            }
        }
    }
    
    func sendAction(_ action: String) {
        if WCSession.default.isReachable {
            WCSession.default.sendMessage(["action": action], replyHandler: nil, errorHandler: nil)
        }
    }
}
