//app/src/dashboard/components/MobileQRCard.tsx
'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Smartphone, X, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileQRCard() {
    const [showQR, setShowQR] = useState(false);
    const [localUrl, setLocalUrl] = useState('');
    const [networkIP, setNetworkIP] = useState('');

    useEffect(() => {
        // Get the current URL and replace localhost with network IP hint
        if (typeof window !== 'undefined') {
            const currentUrl = window.location.origin;

            // For the QR code, we want to point to the home page (which will redirect to login if needed)
            // Replace /dashboard with just the base URL
            const baseUrl = currentUrl.replace('localhost', '[YOUR-IP]');
            setLocalUrl(baseUrl);

            // Try to get network info from the URL if available
            const hostname = window.location.hostname;
            if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
                setNetworkIP(hostname);
                setLocalUrl(`http://${hostname}:${window.location.port || '3000'}`);
            }
        }
    }, []);

    const getNetworkUrl = () => {
        if (typeof window !== 'undefined') {
            const port = window.location.port || '3000';
            // If we have a network IP, use it, otherwise show placeholder
            if (networkIP) {
                return `http://${networkIP}:${port}`;
            }
            return `http://[YOUR-NETWORK-IP]:${port}`;
        }
        return '';
    };

    return (
        <>
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl p-6 hover:border-blue-700/50 transition-all">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                            <Smartphone className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-1">
                            View on Mobile
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Scan the QR code to open this page on your mobile device
                        </p>
                        <button
                            onClick={() => setShowQR(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Smartphone className="w-4 h-4" />
                            Show QR Code
                        </button>
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQR && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                        onClick={() => setShowQR(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowQR(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* QR Code */}
                            <div className="flex flex-col items-center">
                                <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                                    <QRCode
                                        value={getNetworkUrl()}
                                        size={200}
                                        level="H"
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                    />
                                </div>

                                {/* Instructions */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                    Scan this with your camera
                                </h3>
                                <p className="text-gray-600 text-center mb-4">
                                    Open your phone's camera and point it at the QR code
                                </p>

                                {/* Network Setup Instructions */}
                                <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                                    <div className="flex items-start gap-2">
                                        <Wifi className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-amber-900 mb-1">
                                                Setup Required
                                            </p>
                                            <p className="text-xs text-amber-800">
                                                To use this QR code, you need to:
                                            </p>
                                            <ol className="text-xs text-amber-800 mt-2 space-y-1 list-decimal list-inside">
                                                <li>Find your computer's IP address</li>
                                                <li>Replace [YOUR-NETWORK-IP] in the URL below</li>
                                                <li>Make sure your phone is on the same WiFi</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>

                                {/* URL Display */}
                                <div className="w-full bg-gray-100 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 text-center font-mono break-all">
                                        {getNetworkUrl()}
                                    </p>
                                </div>

                                {/* How to find IP */}
                                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 w-full">
                                    <p className="text-xs text-blue-800 mb-2">
                                        <strong>💡 How to find your IP:</strong>
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        • Windows: Run <code className="bg-blue-100 px-1 rounded">ipconfig</code> in Command Prompt<br />
                                        • Mac/Linux: Run <code className="bg-blue-100 px-1 rounded">ifconfig</code> in Terminal<br />
                                        • Look for "IPv4 Address" (usually starts with 192.168.x.x)
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

