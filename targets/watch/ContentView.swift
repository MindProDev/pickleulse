import SwiftUI

struct ContentView: View {
    @StateObject var viewModel = ViewModel()
    
    var body: some View {
        VStack {
            HStack {
                VStack {
                    Text("US")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.blue)
                    Text("\(viewModel.scoreA)")
                        .font(.system(size: 40, weight: .heavy))
                        .foregroundColor(.white)
                }
                .onTapGesture {
                    viewModel.sendAction("SCORE_A")
                }
                
                Spacer()
                
                VStack {
                    Text("THEM")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.red)
                    Text("\(viewModel.scoreB)")
                        .font(.system(size: 40, weight: .heavy))
                        .foregroundColor(.white)
                }
                .onTapGesture {
                    viewModel.sendAction("SCORE_B")
                }
            }
            .padding()
            
            Button(action: {
                viewModel.sendAction("UNDO")
            }) {
                Image(systemName: "arrow.uturn.backward")
                    .font(.title2)
            }
            .buttonStyle(BorderedButtonStyle())
            .tint(.orange)
        }
        .background(Color.black)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
