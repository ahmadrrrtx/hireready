// ============================================================
// PAGE: CERTIFICATE VERIFICATION
// Public portal for validating certificates
// ============================================================

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Certificate } from '../types';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const hashParam = searchParams.get('hash');

  const [hash, setHash] = useState(hashParam || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hashParam) {
      handleVerify();
    }
  }, [hashParam]);

  const handleVerify = async () => {
    if (!hash.trim()) {
      setError('Please enter a verification code');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setCertificate(null);

    try {
      const { data, error: dbError } = await supabase
        .from('certificates')
        .select('*')
        .eq('verification_hash', hash)
        .single();

      if (dbError || !data) {
        setError('Invalid verification code. Certificate not found.');
        return;
      }

      setCertificate(data);
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 neon-border"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Certificate Verification
          </h1>
          <p className="text-gray-400">
            Verify the authenticity of HireReady certificates
          </p>
        </div>

        {/* Search Box */}
        {!certificate && (
          <Card variant="bordered">
            <CardContent className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder="Enter the verification hash from the certificate"
                    className="glass-input flex-1"
                  />
                  <Button
                    onClick={handleVerify}
                    isLoading={isVerifying}
                    variant="primary"
                  >
                    Verify
                  </Button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 border border-red-500/30 bg-red-900/10"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Verified Certificate Display */}
        {certificate && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="bordered" className="border-green-500/50 bg-green-900/5">
              <CardContent className="p-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4"
                  >
                    <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-green-400 mb-2">
                    ✓ Certificate Verified
                  </h2>
                  <p className="text-sm text-gray-400">
                    This is an authentic HireReady certificate
                  </p>
                </div>

                {/* Certificate Details */}
                <div className="space-y-4">
                  <div className="glass-card p-4 border border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Recipient</p>
                    <p className="text-lg font-semibold text-white">
                      {certificate.user_name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 border border-white/10">
                      <p className="text-xs text-gray-500 mb-1">Topic</p>
                      <p className="text-sm font-medium text-white">
                        {certificate.topic}
                      </p>
                    </div>
                    <div className="glass-card p-4 border border-white/10">
                      <p className="text-xs text-gray-500 mb-1">Score</p>
                      <p className="text-sm font-medium text-white">
                        {certificate.score}%
                      </p>
                    </div>
                  </div>

                  {certificate.roadmap_title && (
                    <div className="glass-card p-4 border border-white/10">
                      <p className="text-xs text-gray-500 mb-1">Roadmap Completed</p>
                      <p className="text-sm font-medium text-white">
                        {certificate.roadmap_title}
                      </p>
                    </div>
                  )}

                  <div className="glass-card p-4 border border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Issued On</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(certificate.issued_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="glass-card p-4 border border-purple-500/30 bg-purple-900/10">
                    <p className="text-xs text-purple-400 mb-1">Verification Hash</p>
                    <p className="text-xs font-mono text-gray-300 break-all">
                      {certificate.verification_hash}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-white/10 flex gap-3">
                  <Button
                    onClick={() => {
                      setCertificate(null);
                      setHash('');
                    }}
                    variant="ghost"
                    fullWidth
                  >
                    Verify Another
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    variant="primary"
                    fullWidth
                  >
                    Print Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            This verification system uses cryptographic hashing to ensure certificate authenticity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
