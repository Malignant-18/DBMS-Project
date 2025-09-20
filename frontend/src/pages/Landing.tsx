import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-slate-900/30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                EzyVote
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Secure, transparent, and efficient online voting platform for institutional clubs and organizations
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Login to Vote
              </Link>
              <Link 
                to="/register" 
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Built with security, transparency, and user experience in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Authentication</h3>
              <p className="text-gray-300">
                Role-based access control ensures only authorized users can participate in elections
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Prevent Multiple Voting</h3>
              <p className="text-gray-300">
                Advanced algorithms ensure one person, one vote policy is strictly maintained
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Results</h3>
              <p className="text-gray-300">
                Live vote counting and instant result compilation for transparent elections
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current ongoing Elections Section */}
      {/*<div className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current & Upcoming Elections
            </h2>
            <p className="text-lg text-gray-600">
              Participate in active elections or stay tuned for upcoming ones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Active
                </span>
                <span className="text-sm text-gray-500">Ends in 2 days</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Student Council Elections
              </h3>
              <p className="text-gray-600 mb-4">
                Vote for your representatives in the annual student council elections
              </p>
              <div className="text-sm text-gray-500">
                <p>📊 245 votes cast</p>
                <p>👥 5 candidates</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Upcoming
                </span>
                <span className="text-sm text-gray-500">Starts in 5 days</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tech Club Leadership
              </h3>
              <p className="text-gray-600 mb-4">
                Choose the next president and vice-president for the Technology Club
              </p>
              <div className="text-sm text-gray-500">
                <p>📊 Registration open</p>
                <p>👥 8 candidates</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Upcoming
                </span>
                <span className="text-sm text-gray-500">Starts in 1 week</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cultural Committee
              </h3>
              <p className="text-gray-600 mb-4">
                Select coordinators for various cultural activities and events
              </p>
              <div className="text-sm text-gray-500">
                <p>📊 Registration open</p>
                <p>👥 12 candidates</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-purple-900 via-slate-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students already using our platform for democratic participation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
            >
              Start Voting Now
            </Link>
            <Link 
              to="/register" 
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-white/30"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2025 Institutional Voting System. Secure • Transparent • Democratic
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
