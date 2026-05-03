import React from 'react';
import { loginWithEmail } from '../../lib/firebase';
import { LogIn, Phone, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import nepalEmblem from '../../assets/Emblem_of_Nepal.svg';

export const Login: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError('Invalid credentials. Please ensure test@gmail.com / test@123 is enabled in Firebase Console.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8 md:p-12 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl flex flex-col md:flex-row items-center"
      >
        {/* Left Side: Government Branding (Blue) */}
        <div className="relative w-full md:w-1/2 bg-[#1a4a8c] p-6 md:p-8 flex flex-col text-white rounded-xl shadow-2xl z-20 md:-my-10">
          <div className="flex flex-col items-center flex-grow">
            <div className="mb-4">
              <img 
                src={nepalEmblem} 
                alt="Emblem of Nepal" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </div>
            <p className="text-sm md:text-base font-bold mb-4">नेपाल सरकार</p>
            
            <div className="w-full h-[1px] bg-white/20 mb-6" />

            <p className="text-xl md:text-xl font-bold text-center">
              Welcome to
            </p>

            <h1 className="text-xl md:text-xl font-bold text-center leading-tight mb-2 mt-4 tracking-normal  mb-6">
              Digital Registry for Landless and Informal Settlements
            </h1>
            

            {/* Assistance Box */}
            <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-5 space-y-3">
              <h2 className="text-sm font-bold">सहायता नम्बर</h2>
              <div className="space-y-1.5 text-xs font-semibold">
                <p>DRLIS: 977XXXXXXX</p>
                <p>Attendance: 977XXXXXXX</p>
                <p>Digital Signature: 977XXXXXXX</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[10px] opacity-90 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
            <span>© सूचना प्रविधि विभाग</span>
          </div>
        </div>

        {/* Right Side: Login Form (White) */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white rounded-r-xl shadow-lg z-10">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-6 text-left">
              <h2 className="text-2xl font-black text-[#1a4a8c] mb-1 tracking-tight">लग -इन</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 block pl-1">ईमेल</label>
                  <div className="relative group">
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="test@gmail.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 outline-none focus:border-[#1a4a8c] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 block pl-1">पासवर्ड</label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 outline-none focus:border-[#1a4a8c] transition-all"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="text-right">
                    {/* <a href="#" className="text-xs font-bold text-[#1a4a8c] hover:underline">पासवर्ड भुल्नु भयो?</a> */}
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2"
                >
                  <div className="p-0.5 bg-red-100 rounded text-red-600">
                    <ShieldCheck size={14} />
                  </div>
                  <p className="text-[10px] text-red-600 font-bold leading-tight">{error}</p>
                </motion.div>
              )}

              <button
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1a4a8c] text-white rounded-lg font-bold text-base hover:bg-[#163b73] transition-all active:scale-[0.98] shadow-md shadow-blue-900/5 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    प्रक्रियामा छ...
                  </span>
                ) : (
                  <>
                    <span>लग -इन</span>
                    {/* <LogIn className="w-4 h-4" /> */}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );

};
