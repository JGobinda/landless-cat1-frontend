import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, Check, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  buttonLabel?: string;
  currentImage?: string | null;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, buttonLabel = "Capture Photo", currentImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setImage(null);
  };

  const handleSave = () => {
    if (image) {
      onCapture(image);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        {currentImage ? (
          <div className="relative group animate-in zoom-in duration-300">
            <div 
              onClick={() => setIsOpen(true)}
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-blue-900/10 cursor-pointer transition-transform hover:scale-105"
            >
              <img 
                src={currentImage} 
                alt="Applicant" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Camera size={24} className="text-white" />
              </div>
            </div>
            <button
               type="button"
               onClick={(e) => {
                 e.stopPropagation();
                 onCapture('');
               }}
               className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg border-2 border-white transition-all active:scale-90"
            >
               <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setIsOpen(true);
            }}
            className="w-20 h-20 bg-[#1a4a8c] text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-900/20 hover:bg-[#1a4a8c]/90 transition-all active:scale-95"
          >
            <Camera size={24} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsOpen(false)}>
          <div 
            className="relative flex flex-col items-center overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-10 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300" 
            style={{ width: '100%', maxWidth: '550px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between mb-8">
              <div className="flex flex-col">
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Image</h3>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Biometric applicant verification</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-2xl p-4 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 w-full border-4 border-slate-50 shadow-inner" style={{ aspectRatio: '4/3' }}>
              {!image ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover scale-x-110"
                  disablePictureInPicture={true}
                  forceScreenshotSourceSize={false}
                  imageSmoothing={true}
                  mirrored={true}
                  onUserMedia={() => {}}
                  onUserMediaError={() => {}}
                  screenshotQuality={0.92}
                />
              ) : (
                <img src={image} alt="Captured" className="w-full h-full object-cover" />
              )}
              
              {!image && (
                <div className="absolute inset-0 border-[2px] border-white/20 pointer-events-none rounded-[2rem] m-4 flex items-center justify-center">
                   <div className="w-48 h-64 border-[1px] border-dashed border-white/40 rounded-full" />
                </div>
              )}
            </div>
            
            <div className="mt-10 flex w-full gap-4">
              {!image ? (
                <button
                  onClick={capture}
                  className="w-full py-6 bg-[#1a4a8c] hover:bg-[#1a4a8c]/90 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.25em] transition-all active:scale-95 shadow-xl shadow-blue-900/20 flex items-center justify-center gap-4"
                >
                  <Camera size={20} />
                  Initiate Capture
                </button>
              ) : (
                <>
                  <button
                    onClick={retake}
                    className="flex-1 py-6 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <RotateCcw size={18} />
                    Reset
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-[2] py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3"
                  >
                    <Check size={18} />
                    Confirm & Sync
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
