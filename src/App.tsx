import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Menu, X, ArrowRight, Shield, Lock, Users, ChevronRight,
    Search, History, Cloud, Eye, Server, CheckCircle, AlertTriangle,
    Settings, Upload, FileText, Database, RefreshCw, UserPlus,
    ShieldCheck, Activity, UserCog, ChevronDown, ChevronUp, Sun, Moon,
    Sparkles, ArrowUp, Play, XCircle, Info, AlertCircle, Loader2
} from 'lucide-react';

// ==================== TYPES ====================
interface Toast {
    id: number;
    type: 'success' | 'error' | 'info';
    message: string;
}

// ==================== UTILITIES ====================
// ==================== COMPONENTS ====================

// Skeleton Loader
const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-slate-700/30 rounded ${className}`} />
);

// Lazy Image with Skeleton
const LazyImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={`relative ${className}`}>
            {!loaded && !error && <Skeleton className="absolute inset-0" />}
            {error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <AlertCircle className="w-8 h-8 text-slate-500" />
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    loading="lazy"
                />
            )}
        </div>
    );
};

// Toast Notification
const ToastNotification = ({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) => {
    const icons = { success: CheckCircle, error: XCircle, info: Info };
    const colors = {
        success: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
        error: 'bg-red-500/20 border-red-500/50 text-red-400',
        info: 'bg-blue-500/20 border-blue-500/50 text-blue-400'
    };
    const Icon = icons[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${colors[toast.type]}`}
            role="alert"
            aria-live="polite"
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{toast.message}</span>
            <button
                onClick={onDismiss}
                className="ml-auto p-1 hover:bg-white/10 rounded transition-colors"
                aria-label="Dismiss notification"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// Toast Container
const ToastContainer = ({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) => (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
            {toasts.map(toast => (
                <ToastNotification key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
            ))}
        </AnimatePresence>
    </div>
);

// Back to Top Button
const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 500);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToTop}
                    className="fixed bottom-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

// Loading Button
const LoadingButton = ({
    children,
    loading,
    onClick,
    className = '',
    ariaLabel = ''
}: {
    children: React.ReactNode;
    loading: boolean;
    onClick: () => void;
    className?: string;
    ariaLabel?: string;
}) => (
    <motion.button
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        onClick={onClick}
        disabled={loading}
        className={`relative ${className} ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
        aria-label={ariaLabel}
        aria-busy={loading}
    >
        {loading && <Loader2 className="w-5 h-5 animate-spin absolute left-4" />}
        <span className={loading ? 'ml-6' : ''}>{children}</span>
    </motion.button>
);

// File Encryption Demo
const EncryptionDemo = ({ darkMode }: { darkMode: boolean }) => {
    const [file, setFile] = useState<string>('');
    const [encrypting, setEncrypting] = useState(false);
    const [encrypted, setEncrypted] = useState(false);
    const [progress, setProgress] = useState(0);

    const simulateEncryption = () => {
        if (!file) return;
        setEncrypting(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setEncrypting(false);
                    setEncrypted(true);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 100);
    };

    const reset = () => {
        setFile('');
        setEncrypted(false);
        setProgress(0);
    };

    return (
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-2xl p-6`}>
            <h4 className="text-lg font-semibold mb-4">🔐 Try Encryption Demo</h4>

            {!encrypted ? (
                <>
                    <div className="mb-4">
                        <label htmlFor="demo-file" className="block text-sm mb-2">Enter text to encrypt:</label>
                        <input
                            id="demo-file"
                            type="text"
                            value={file}
                            onChange={(e) => setFile(e.target.value)}
                            placeholder="Type something secret..."
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            aria-describedby="demo-help"
                        />
                        <p id="demo-help" className="text-xs mt-1 opacity-60">This is a simulation - no data is sent anywhere</p>
                    </div>

                    {encrypting && (
                        <div className="mb-4" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-sm mt-2 opacity-60">Encrypting... {Math.round(progress)}%</p>
                        </div>
                    )}

                    <LoadingButton
                        loading={encrypting}
                        onClick={simulateEncryption}
                        className={`w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white`}
                        ariaLabel="Encrypt the entered text"
                    >
                        {encrypting ? 'Encrypting...' : 'Encrypt Now'}
                    </LoadingButton>
                </>
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-white'} p-4 rounded-lg mb-4`}>
                        <p className="text-xs opacity-60 mb-1">Original:</p>
                        <p className="font-mono text-sm">{file}</p>
                    </div>
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-white'} p-4 rounded-lg mb-4`}>
                        <p className="text-xs opacity-60 mb-1">Encrypted (AES-256):</p>
                        <p className="font-mono text-sm break-all text-blue-400">
                            {btoa(file).split('').map(c => c + Math.random().toString(36).substr(2, 3)).join('').slice(0, 64)}...
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm text-emerald-400">Successfully encrypted!</span>
                    </div>
                    <button
                        onClick={reset}
                        className="mt-4 text-sm underline opacity-60 hover:opacity-100"
                        aria-label="Try another encryption"
                    >
                        Try another
                    </button>
                </motion.div>
            )}
        </div>
    );
};

// Comparison Calculator
const ComparisonCalculator = ({ darkMode }: { darkMode: boolean }) => {
    const [files, setFiles] = useState(100);
    const [size, setSize] = useState(5);

    const competitors = [
        { name: 'Secura', pricePerGB: 0, hasE2E: true },
        { name: 'Tresorit', pricePerGB: 0.15, hasE2E: true },
        { name: 'Dropbox', pricePerGB: 0.10, hasE2E: false },
        { name: 'Google Drive', pricePerGB: 0.02, hasE2E: false },
    ];

    const totalGB = files * size;
    const costs = competitors.map(c => ({
        name: c.name,
        cost: c.pricePerGB === 0 ? 0 : totalGB * c.pricePerGB,
        hasE2E: c.hasE2E
    }));

    return (
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-2xl p-6`}>
            <h4 className="text-lg font-semibold mb-4">💰 Cost Calculator</h4>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label htmlFor="num-files" className="block text-sm mb-2">Number of Files</label>
                    <input
                        id="num-files"
                        type="range"
                        min="10"
                        max="1000"
                        value={files}
                        onChange={(e) => setFiles(parseInt(e.target.value))}
                        className="w-full accent-blue-500"
                        aria-valuemin={10}
                        aria-valuemax={1000}
                        aria-valuenow={files}
                    />
                    <p className="text-center font-mono">{files}</p>
                </div>
                <div>
                    <label htmlFor="file-size" className="block text-sm mb-2">Avg. Size (MB)</label>
                    <input
                        id="file-size"
                        type="range"
                        min="1"
                        max="100"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="w-full accent-blue-500"
                        aria-valuemin={1}
                        aria-valuemax={100}
                        aria-valuenow={size}
                    />
                    <p className="text-center font-mono">{size} MB</p>
                </div>
            </div>

            <div className="text-center mb-4">
                <p className="text-sm opacity-60">Total Storage</p>
                <p className="text-2xl font-bold">{(totalGB / 1024).toFixed(2)} GB</p>
            </div>

            <div className="space-y-2">
                {costs.map(c => (
                    <div
                        key={c.name}
                        className={`flex justify-between items-center p-3 rounded-lg ${c.name === 'Secura'
                                ? 'bg-blue-500/20 border border-blue-500/30'
                                : darkMode ? 'bg-slate-700' : 'bg-white'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <span>{c.name}</span>
                            {c.hasE2E && <Lock className="w-3 h-3 text-emerald-400" aria-label="End-to-end encrypted" />}
                        </div>
                        <span className="font-mono">
                            {c.cost === 0 ? 'FREE' : `$${c.cost.toFixed(2)}/mo`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Customer Logos
const CustomerLogos = ({ darkMode }: { darkMode: boolean }) => {
    const logos = [
        'Stanford', 'MIT', 'Harvard', 'Yale', 'Princeton',
        'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'
    ];

    return (
        <section className={`py-16 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className={`text-sm uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-600'} mb-2`}>
                        Trusted by leading institutions
                    </p>
                    <h2 className="text-2xl font-bold">Join 10,000+ organizations</h2>
                </motion.div>

                <div className="relative overflow-hidden">
                    <motion.div
                        className="flex gap-12 items-center"
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    >
                        {[...logos, ...logos].map((logo, i) => (
                            <div
                                key={i}
                                className={`flex-shrink-0 px-6 py-3 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white shadow-sm'
                                    }`}
                            >
                                <span className={`text-lg font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {logo}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// Video Section
const VideoSection = ({ darkMode }: { darkMode: boolean }) => {
    const [playing, setPlaying] = useState(false);

    return (
        <section className="py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        See how it{' '}
                        <span className={`bg-gradient-to-r ${darkMode ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`}>
                            works
                        </span>
                    </h2>
                    <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Watch our 2-minute demo to see Secura in action
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800"
                >
                    {!playing ? (
                        <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                            onClick={() => setPlaying(true)}
                            role="button"
                            tabIndex={0}
                            aria-label="Play demo video"
                            onKeyDown={(e) => e.key === 'Enter' && setPlaying(true)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20" />
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="relative z-10 w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl"
                            >
                                <Play className="w-8 h-8 text-blue-600 ml-1" />
                            </motion.div>
                            <p className="absolute bottom-8 text-white/80">Click to play demo</p>
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                            <p className="text-slate-400">Video placeholder - integrate with YouTube/Vimeo</p>
                            <button
                                onClick={() => setPlaying(false)}
                                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"
                                aria-label="Close video"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

// Feature Tour
const FeatureTour = ({ darkMode, onClose }: { darkMode: boolean; onClose: () => void }) => {
    const [step, setStep] = useState(0);
    const steps = [
        { title: 'Upload Files', description: 'Drag and drop or click to upload any file type' },
        { title: 'Auto Encryption', description: 'Files are automatically encrypted with AES-256' },
        { title: 'Choose Storage', description: 'Save locally, to cloud, or use our platform' },
        { title: 'Share Securely', description: 'Share with encrypted links and expiry dates' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-title"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-8 max-w-md mx-4 shadow-xl`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 id="tour-title" className="text-xl font-bold">Quick Tour</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded" aria-label="Close tour">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex gap-2 mb-4">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded ${i <= step ? 'bg-blue-500' : darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                            />
                        ))}
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{steps[step].title}</h4>
                    <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{steps[step].description}</p>
                </div>

                <div className="flex gap-3">
                    {step > 0 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className={`flex-1 py-2 rounded-lg border ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}
                        >
                            Previous
                        </button>
                    )}
                    {step < steps.length - 1 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ==================== MAIN APP ====================
export default function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState<'users' | 'admins'>('users');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('secura-theme');
            if (saved) return saved === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return true;
    });
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [showTour, setShowTour] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    // Toast helpers
    const addToast = (type: Toast['type'], message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    };

    const dismissToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

    // Effects
    useEffect(() => { localStorage.setItem('secura-theme', darkMode ? 'dark' : 'light'); }, [darkMode]);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show tour for first-time visitors
    useEffect(() => {
        const seen = localStorage.getItem('secura-tour-seen');
        if (!seen) {
            setTimeout(() => setShowTour(true), 2000);
        }
    }, []);

    const closeTour = () => {
        setShowTour(false);
        localStorage.setItem('secura-tour-seen', 'true');
    };

    // Data
    const problems = [
        { icon: <Server className="w-8 h-8" />, title: "Plain Storage", description: "Files stored unencrypted on servers you don't control" },
        { icon: <Eye className="w-8 h-8" />, title: "Weak Privacy", description: "No real user ownership or privacy control" },
        { icon: <Activity className="w-8 h-8" />, title: "No Monitoring", description: "Limited audit trails for accountability" },
        { icon: <AlertTriangle className="w-8 h-8" />, title: "Hacking Risk", description: "Vulnerable to unauthorized access" }
    ];

    const features = [
        { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure Login", description: "Role-based authentication with OTP" },
        { icon: <Cloud className="w-6 h-6" />, title: "Flexible Storage", description: "Local, cloud, or platform storage" },
        { icon: <Search className="w-6 h-6" />, title: "Smart Search", description: "Find files instantly" },
        { icon: <RefreshCw className="w-6 h-6" />, title: "Backup & Recovery", description: "Versioning and recycle bin" },
        { icon: <Lock className="w-6 h-6" />, title: "AES-256", description: "Military-grade encryption" },
        { icon: <History className="w-6 h-6" />, title: "Audit Trails", description: "Complete activity logs" }
    ];

    const secureFlow = [
        { step: 1, icon: <UserPlus className="w-6 h-6" />, title: "Register", description: "Create secure account" },
        { step: 2, icon: <Shield className="w-6 h-6" />, title: "Verify", description: "OTP authentication" },
        { step: 3, icon: <Upload className="w-6 h-6" />, title: "Upload", description: "Select files" },
        { step: 4, icon: <Lock className="w-6 h-6" />, title: "Encrypt", description: "Client-side encryption" },
        { step: 5, icon: <FileText className="w-6 h-6" />, title: "Log", description: "Audit trail" }
    ];

    const coreFeatures = [
        { icon: <Lock className="w-8 h-8" />, title: "Client-Side Encryption", number: "1" },
        { icon: <Users className="w-8 h-8" />, title: "Role-Based Access", number: "2" },
        { icon: <Database className="w-8 h-8" />, title: "Secure Storage", number: "3" },
        { icon: <Activity className="w-8 h-8" />, title: "Activity Logging", number: "4" },
        { icon: <UserCog className="w-8 h-8" />, title: "Admin Monitoring", number: "5" }
    ];

    const competitors = [
        { name: "Secura", e2ee: true, clientSide: true, audit: true, rbac: true, password: true, otp: true, integration: true, pricing: "Free", highlight: true },
        { name: "MEGA", e2ee: true, clientSide: true, audit: false, rbac: true, password: false, otp: true, integration: false, pricing: "Freemium" },
        { name: "Sync.com", e2ee: true, clientSide: true, audit: false, rbac: true, password: false, otp: true, integration: false, pricing: "Paid" },
        { name: "NordLocker", e2ee: true, clientSide: true, audit: false, rbac: false, password: false, otp: true, integration: false, pricing: "Premium" },
        { name: "Dropbox", e2ee: false, clientSide: false, audit: true, rbac: true, password: false, otp: true, integration: false, pricing: "Paid" },
        { name: "Google Drive", e2ee: false, clientSide: false, audit: false, rbac: true, password: false, otp: true, integration: false, pricing: "Varies" },
    ];

    const userWorkflow = [
        { step: 1, title: "Register", description: "Email + OTP authentication" },
        { step: 2, title: "Upload", description: "Bulk upload with passwords" },
        { step: 3, title: "Encrypt", description: "Client-side encryption" },
        { step: 4, title: "Store", description: "Local or cloud storage" }
    ];

    const adminWorkflow = [
        { step: 1, title: "Manage", description: "Create accounts & roles" },
        { step: 2, title: "Monitor", description: "Real-time dashboards" },
        { step: 3, title: "Audit", description: "Export logs" },
        { step: 4, title: "Control", description: "Block & restrict" }
    ];

    const stats = [
        { value: "256-bit", label: "AES Encryption" },
        { value: "100%", label: "Client-Side" },
        { value: "5 min", label: "OTP Expiry" },
        { value: "0", label: "Breaches" }
    ];

    const faqs = [
        { question: "What makes Secura different?", answer: "True client-side encryption - even we can't read your files." },
        { question: "How does encryption work?", answer: "AES-256 encryption in your browser before upload." },
        { question: "Can I password-protect files?", answer: "Yes, add optional passwords per file." },
        { question: "Storage options?", answer: "Download locally, save to cloud, or use our platform." },
        { question: "How does OTP work?", answer: "5-minute one-time passwords via email." },
    ];

    const team = [
        { name: "Umang Gupta", role: "Project Leader", responsibilities: ["Encryption", "Security", "Architecture"] },
        { name: "Tribhuvan Pratap Singh", role: "Frontend Dev", responsibilities: ["UI/UX", "Interactivity"] },
        { name: "Vineet Vikram Rao", role: "Database", responsibilities: ["MySQL", "Cloud"] },
        { name: "Vipul & V. Dhar", role: "Testing", responsibilities: ["QA", "Docs"] }
    ];

    const theme = {
        bg: darkMode ? 'bg-slate-950' : 'bg-slate-50',
        bgAlt: darkMode ? 'bg-slate-900' : 'bg-white',
        bgAlt50: darkMode ? 'bg-slate-900/50' : 'bg-slate-100',
        text: darkMode ? 'text-white' : 'text-slate-900',
        textMuted: darkMode ? 'text-slate-400' : 'text-slate-600',
        border: darkMode ? 'border-slate-800' : 'border-slate-200',
        card: darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
        cardHover: darkMode ? 'hover:border-blue-500/50' : 'hover:border-blue-400',
        gradient: darkMode ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600',
        gradientBg: darkMode ? 'from-blue-600 to-indigo-600' : 'from-blue-500 to-indigo-500',
        accent: darkMode ? 'text-blue-400' : 'text-blue-600',
        accentBg: darkMode ? 'bg-blue-500/20' : 'bg-blue-100',
        success: darkMode ? 'text-blue-400' : 'text-blue-600',
        successBg: darkMode ? 'bg-blue-400' : 'bg-blue-500',
        error: darkMode ? 'text-red-400' : 'text-red-500',
        errorBg: darkMode ? 'bg-red-500/10' : 'bg-red-50',
        errorBorder: darkMode ? 'border-red-500/20' : 'border-red-200',
    };

    // Animation variants respecting reduced motion
    const animationProps = prefersReducedMotion ? { transition: { duration: 0 } } : {};

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} overflow-x-hidden transition-colors duration-500`}>
            {/* Skip Link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
            >
                Skip to main content
            </a>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                {...animationProps}
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? (darkMode ? 'bg-slate-950/95 backdrop-blur-lg border-b border-slate-800' : 'bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm') : ''
                    }`}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }} {...animationProps}>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center`}>
                                <Shield className="w-5 h-5 text-white" aria-hidden="true" />
                            </div>
                            <span className={`text-xl font-bold bg-gradient-to-r ${darkMode ? 'from-white to-slate-400' : 'from-slate-900 to-slate-600'} bg-clip-text text-transparent`}>
                                Secura
                            </span>
                        </motion.div>

                        <div className="hidden lg:flex items-center gap-8" role="menubar">
                            {['Features', 'Security', 'Workflow', 'Compare', 'Team', 'FAQ'].map((item) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className={`${theme.textMuted} hover:text-white transition-colors relative group`}
                                    whileHover={{ y: -2 }}
                                    role="menuitem"
                                    {...animationProps}
                                >
                                    {item}
                                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r ${theme.gradient} group-hover:w-full transition-all duration-300`} />
                                </motion.a>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2.5 rounded-full ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition-all`}
                                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                {...animationProps}
                            >
                                {darkMode ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`${theme.textMuted} hover:text-white transition-colors px-4 py-2`}
                                aria-label="Sign in to your account"
                            >
                                Sign In
                            </motion.button>
                            <motion.a
                                href="https://secura-seven.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`bg-gradient-to-r ${theme.gradientBg} text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg ${darkMode ? 'shadow-blue-500/25' : 'shadow-blue-500/30'}`}
                                aria-label="Get started with Secura for free"
                                {...animationProps}
                            >
                                Get Started Free
                            </motion.a>
                        </div>

                        <div className="flex lg:hidden items-center gap-2">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-full ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
                                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMenuOpen(!menuOpen)}
                                className={`p-2 ${theme.textMuted}`}
                                aria-expanded={menuOpen}
                                aria-controls="mobile-menu"
                                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={menuOpen ? 'close' : 'menu'}
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            id="mobile-menu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`lg:hidden ${darkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-lg border-b ${theme.border}`}
                            role="menu"
                        >
                            <div className="px-4 py-6 space-y-4">
                                {['Features', 'Security', 'Workflow', 'Compare', 'Team', 'FAQ'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className={`block ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} py-2`}
                                        onClick={() => setMenuOpen(false)}
                                        role="menuitem"
                                    >
                                        {item}
                                    </a>
                                ))}
                                <div className="pt-4 space-y-3">
                                    <button className={`w-full ${theme.textMuted} hover:text-white py-2.5 border ${theme.border} rounded-full`}>
                                        Sign In
                                    </button>
                                    <a href="https://secura-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className={`block w-full bg-gradient-to-r ${theme.gradientBg} text-white py-2.5 rounded-full font-medium text-center`}>
                                        Get Started Free
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Main Content */}
            <main id="main-content">
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" aria-labelledby="hero-heading">
                    <div className="absolute inset-0">
                        <LazyImage src="/security-bg.jpg" alt="" className="w-full h-full object-cover opacity-20" />
                        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950' : 'bg-gradient-to-b from-blue-50/50 via-white/80 to-slate-50'}`} />
                    </div>

                    <motion.div
                        className={`absolute top-1/4 left-1/4 w-96 h-96 ${darkMode ? 'bg-blue-500/20' : 'bg-blue-300/30'} rounded-full blur-3xl`}
                        animate={prefersReducedMotion ? {} : { y: [0, -20, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        aria-hidden="true"
                    />
                    <motion.div
                        className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-300/30'} rounded-full blur-3xl`}
                        animate={prefersReducedMotion ? {} : { y: [0, 20, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        aria-hidden="true"
                    />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                        <div className="text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className={`inline-flex items-center gap-2 ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'} border rounded-full px-4 py-1.5 mb-8`}
                            >
                                <motion.div
                                    animate={prefersReducedMotion ? {} : { rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className={`w-4 h-4 ${theme.accent}`} aria-hidden="true" />
                                </motion.div>
                                <span className={`text-sm ${theme.textMuted}`}>Secure File Storage System</span>
                                <ChevronRight className={`w-4 h-4 ${theme.textMuted}`} aria-hidden="true" />
                            </motion.div>

                            <motion.h1
                                id="hero-heading"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6"
                            >
                                Secure file vault<br />
                                <motion.span
                                    className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent inline-block`}
                                    animate={prefersReducedMotion ? {} : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    style={{ backgroundSize: '200% 200%' }}
                                >
                                    for every device
                                </motion.span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className={`text-lg sm:text-xl ${theme.textMuted} max-w-3xl mx-auto mb-10`}
                            >
                                Your encrypted workspace on web and mobile. Keep files protected, searchable, and always in your control.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            >
                                <motion.a
                                    href="https://secura-seven.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`group bg-gradient-to-r ${theme.gradientBg} text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl flex items-center gap-2`}
                                    aria-label="Open Secura for free"
                                >
                                    Open Free
                                    <motion.span animate={prefersReducedMotion ? {} : { x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                        <ArrowRight className="w-5 h-5" aria-hidden="true" />
                                    </motion.span>
                                </motion.a>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowTour(true)}
                                    className={`flex items-center gap-2 ${darkMode ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-300'} px-8 py-4 rounded-full font-semibold border transition-all`}
                                    aria-label="Take a feature tour"
                                >
                                    <Play className="w-5 h-5" aria-hidden="true" />
                                    Take Tour
                                </motion.button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className={`mt-16 pt-16 border-t ${theme.border}`}
                            >
                                <p className={`${theme.textMuted} text-sm mb-6`}>Your data. Your control. Fully protected.</p>
                                <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
                                    {['HIPAA', 'GDPR', 'SOC 2', 'ISO 27001', 'Zero-Knowledge'].map((cert, i) => (
                                        <motion.div
                                            key={cert}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.6 + i * 0.1 }}
                                            whileHover={{ scale: 1.1, y: -5 }}
                                            className={`flex items-center gap-2 ${darkMode ? 'bg-slate-800/50' : 'bg-white'} px-4 py-2 rounded-lg cursor-pointer`}
                                            role="listitem"
                                        >
                                            <CheckCircle className={`w-4 h-4 ${theme.accent}`} aria-hidden="true" />
                                            <span className={`text-sm font-medium ${theme.textMuted}`}>{cert}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Customer Logos */}
                <CustomerLogos darkMode={darkMode} />

                {/* Problem Statement */}
                <section className={`py-20 ${theme.bgAlt50}`} aria-labelledby="problems-heading">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 id="problems-heading" className="text-3xl sm:text-4xl font-bold mb-4">
                                Is your data really{' '}
                                <motion.span
                                    className={theme.error}
                                    animate={prefersReducedMotion ? {} : { opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    safe in the cloud?
                                </motion.span>
                            </h2>
                            <p className={`text-lg ${theme.textMuted} max-w-2xl mx-auto`}>
                                Most people store important files on cloud platforms—but they don't know who can access them.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
                            {problems.map((item, index) => (
                                <motion.article
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className={`${theme.bgAlt} border ${theme.errorBorder} rounded-2xl p-6 text-center transition-all duration-300`}
                                    role="listitem"
                                >
                                    <motion.div
                                        className={`w-16 h-16 rounded-full ${theme.errorBg} flex items-center justify-center mx-auto mb-4 ${theme.error}`}
                                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                    >
                                        {item.icon}
                                    </motion.div>
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className={`${theme.textMuted} text-sm`}>{item.description}</p>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Solution Section */}
                <section className="py-20 lg:py-32" aria-labelledby="solution-heading">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 id="solution-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                Our Solution: <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Secura</span>
                            </h2>
                            <p className={`text-lg ${theme.textMuted} max-w-3xl mx-auto`}>
                                We built Secura—a system where users control their data using encryption, authentication, and secure storage.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
                            {coreFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.05 }}
                                    className={`relative ${theme.card} rounded-2xl p-6 text-center ${theme.cardHover} transition-all cursor-pointer`}
                                    tabIndex={0}
                                    role="article"
                                >
                                    <motion.div
                                        className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center text-sm font-bold text-white`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {feature.number}
                                    </motion.div>
                                    <div className={`w-14 h-14 rounded-xl ${theme.accentBg} flex items-center justify-center mx-auto mb-3 ${theme.accent}`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-sm font-semibold">{feature.title}</h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5-Step Secure Flow */}
                <section className={`py-20 lg:py-32 ${theme.bgAlt50}`} aria-labelledby="flow-heading">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 id="flow-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                5-Step <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Secure Flow</span>
                            </h2>
                        </motion.div>

                        <ol className="grid md:grid-cols-5 gap-4">
                            {secureFlow.map((item, index) => (
                                <motion.li
                                    key={item.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="relative"
                                >
                                    {index < 4 && (
                                        <div className={`hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r ${darkMode ? 'from-blue-500/50' : 'from-blue-400/50'} to-transparent z-0`} aria-hidden="true" />
                                    )}
                                    <div className={`relative ${theme.card} rounded-2xl p-6 h-full ${theme.cardHover} transition-all`}>
                                        <motion.div
                                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center mx-auto mb-4 text-white`}
                                            whileHover={{ scale: 1.1, rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {item.icon}
                                        </motion.div>
                                        <div className={`text-2xl font-bold ${theme.accent} mb-2`}>Step {item.step}</div>
                                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                        <p className={`${theme.textMuted} text-sm`}>{item.description}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Video Section */}
                <VideoSection darkMode={darkMode} />

                {/* Key Features */}
                <section id="features" className="py-20 lg:py-32" aria-labelledby="features-heading">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Key <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Features</span></h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {features.map((feature, index) => (
                                <motion.article
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className={`group relative ${theme.bgAlt50} border ${theme.border} rounded-2xl p-6 lg:p-8 ${theme.cardHover} transition-all duration-300`}
                                    tabIndex={0}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-blue-500/10 to-indigo-500/10' : 'from-blue-100/50 to-indigo-100/50'} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    <div className="relative">
                                        <motion.div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center mb-4 text-white`}
                                            whileHover={{ scale: 1.1, rotate: -5 }}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className={theme.textMuted}>{feature.description}</p>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 lg:py-32 relative overflow-hidden" aria-label="Statistics">
                    <div className={`absolute inset-0 bg-gradient-to-r ${darkMode ? 'from-blue-600/10 via-indigo-600/10 to-violet-600/10' : 'from-blue-100 via-indigo-100 to-violet-100'}`} />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className="text-center cursor-pointer"
                                    tabIndex={0}
                                >
                                    <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent mb-2`}>
                                        {stat.value}
                                    </div>
                                    <div className={theme.textMuted}>{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Competitor Comparison */}
                <section id="compare" className="py-20 lg:py-32" aria-labelledby="compare-heading">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 id="compare-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">We <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>extend</span>, not compete</h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="overflow-x-auto"
                        >
                            <table className={`w-full min-w-[800px] ${darkMode ? '' : 'bg-white rounded-2xl overflow-hidden shadow-sm'}`} role="table">
                                <caption className="sr-only">Comparison of Secura with other file storage platforms</caption>
                                <thead>
                                    <tr className={`border-b ${theme.border}`}>
                                        <th scope="col" className="text-left py-4 px-4 font-semibold">Platform</th>
                                        <th scope="col" className="text-center py-4 px-4 font-semibold">E2E</th>
                                        <th scope="col" className="text-center py-4 px-4 font-semibold">Client</th>
                                        <th scope="col" className="text-center py-4 px-4 font-semibold">Audit</th>
                                        <th scope="col" className="text-center py-4 px-4 font-semibold">RBAC</th>
                                        <th scope="col" className="text-center py-4 px-4 font-semibold">Password</th>
                                        <th scope="col" className="text-center py-4 px-4 font-semibold">OTP</th>
                                        <th scope="col" className="text-center py-4 px-4 font-semibold">Integration</th>
                                        <th scope="col" className="text-center py-4 px-4 font-semibold">Pricing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {competitors.map((comp, index) => (
                                        <motion.tr
                                            key={comp.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ backgroundColor: comp.highlight ? (darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)') : (darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)') }}
                                            className={`border-b ${theme.border}/50 ${comp.highlight ? (darkMode ? 'bg-blue-500/10' : 'bg-blue-50') : ''} transition-colors duration-300`}
                                        >
                                            <td className={`py-4 px-4 font-medium ${comp.highlight ? theme.accent : ''}`}>{comp.name}</td>
                                            <td className="text-center py-4 px-4">{comp.e2ee ? <CheckCircle className={`w-5 h-5 ${theme.success} mx-auto`} aria-label="Yes" /> : <X className={`w-5 h-5 ${theme.error} mx-auto`} aria-label="No" />}</td>
                                            <td className="text-center py-4 px-4">{comp.clientSide ? <CheckCircle className={`w-5 h-5 ${theme.success} mx-auto`} aria-label="Yes" /> : <X className={`w-5 h-5 ${theme.error} mx-auto`} aria-label="No" />}</td>
                                            <td className="text-center py-4 px-4">{comp.audit ? <CheckCircle className={`w-5 h-5 ${theme.success} mx-auto`} aria-label="Yes" /> : <X className={`w-5 h-5 ${theme.error} mx-auto`} aria-label="No" />}</td>
                                            <td className="text-center py-4 px-4">{comp.rbac ? <CheckCircle className={`w-5 h-5 ${theme.success} mx-auto`} aria-label="Yes" /> : <X className={`w-5 h-5 ${theme.error} mx-auto`} aria-label="No" />}</td>
                                            <td className="text-center py-4 px-4">{comp.password ? <CheckCircle className={`w-5 h-5 ${theme.success} mx-auto`} aria-label="Yes" /> : <X className={`w-5 h-5 ${theme.error} mx-auto`} aria-label="No" />}</td>
                                            <td className="text-center py-4 px-4">{comp.otp ? <CheckCircle className={`w-5 h-5 ${theme.success} mx-auto`} aria-label="Yes" /> : <X className={`w-5 h-5 ${theme.error} mx-auto`} aria-label="No" />}</td>
                                            <td className="text-center py-4 px-4">{comp.integration ? <CheckCircle className={`w-5 h-5 ${theme.success} mx-auto`} aria-label="Yes" /> : <X className={`w-5 h-5 ${theme.error} mx-auto`} aria-label="No" />}</td>
                                            <td className={`text-center py-4 px-4 text-sm ${theme.textMuted}`}>{comp.pricing}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </div>
                </section>

                {/* Interactive Demo & Calculator */}
                <section className={`py-20 lg:py-32 ${theme.bgAlt50}`} aria-labelledby="demo-heading">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 id="demo-heading" className="text-3xl sm:text-4xl font-bold mb-4">Try it yourself</h2>
                            <p className={`text-lg ${theme.textMuted}`}>Experience the encryption and see the savings</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <EncryptionDemo darkMode={darkMode} />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <ComparisonCalculator darkMode={darkMode} />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Workflow Section */}
                <section id="workflow" className={`py-20 lg:py-32`} aria-labelledby="workflow-heading">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 id="workflow-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">System Workflow</h2>
                        </motion.div>

                        <div className="flex justify-center mb-12" role="tablist">
                            <div className={`${darkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full p-1 flex`}>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === 'users' ? `bg-gradient-to-r ${theme.gradientBg} text-white` : theme.textMuted}`}
                                    role="tab"
                                    aria-selected={activeTab === 'users'}
                                    aria-controls="user-panel"
                                    id="user-tab"
                                >
                                    <Users className="w-4 h-4 inline mr-2" aria-hidden="true" />User Flow
                                </button>
                                <button
                                    onClick={() => setActiveTab('admins')}
                                    className={`px-6 py-2.5 rounded-full font-medium transition-all ${activeTab === 'admins' ? `bg-gradient-to-r ${theme.gradientBg} text-white` : theme.textMuted}`}
                                    role="tab"
                                    aria-selected={activeTab === 'admins'}
                                    aria-controls="admin-panel"
                                    id="admin-tab"
                                >
                                    <Settings className="w-4 h-4 inline mr-2" aria-hidden="true" />Admin Flow
                                </button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                                role="tabpanel"
                                id={`${activeTab}-panel`}
                                aria-labelledby={`${activeTab}-tab`}
                            >
                                {(activeTab === 'users' ? userWorkflow : adminWorkflow).map((item, index) => (
                                    <motion.div
                                        key={item.step}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className={`${theme.card} rounded-2xl p-6 h-full`}
                                        tabIndex={0}
                                    >
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center text-xl font-bold mb-4 text-white`}>{item.step}</div>
                                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                        <p className={`${theme.textMuted} text-sm`}>{item.description}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>

                {/* Team Section */}
                <section id="team" className={`py-20 lg:py-32 ${theme.bgAlt50}`} aria-labelledby="team-heading">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 id="team-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Meet the <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>team</span></h2>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            {team.map((member, index) => (
                                <motion.article
                                    key={member.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className={`${theme.card} rounded-2xl p-6 ${theme.cardHover} transition-all group`}
                                    tabIndex={0}
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${darkMode ? 'from-blue-500 to-indigo-500' : 'from-blue-600 to-indigo-600'} flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold`}>
                                        {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <h3 className="text-lg font-semibold text-center mb-1">{member.name}</h3>
                                    <p className={`${theme.accent} text-sm text-center mb-4`}>{member.role}</p>
                                    <ul className="space-y-2">
                                        {member.responsibilities.map((resp: string) => (
                                            <li key={resp} className={`flex items-center gap-2 text-sm ${theme.textMuted}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${theme.successBg}`} />
                                                {resp}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className={`py-20 lg:py-32`} aria-labelledby="faq-heading">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 id="faq-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Frequently asked <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>questions</span></h2>
                        </motion.div>

                        <div className="space-y-4" role="list">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.05 }}
                                    className={`${theme.card} rounded-2xl overflow-hidden ${theme.cardHover} transition-all`}
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full p-6 text-left flex items-center justify-between"
                                        aria-expanded={openFaq === index}
                                        aria-controls={`faq-answer-${index}`}
                                        id={`faq-question-${index}`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setOpenFaq(openFaq === index ? null : index);
                                            }
                                        }}
                                    >
                                        <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                                        <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                            {openFaq === index ? <ChevronUp className={`w-5 h-5 ${theme.accent}`} /> : <ChevronDown className={`w-5 h-5 ${theme.textMuted}`} />}
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                id={`faq-answer-${index}`}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                                role="region"
                                                aria-labelledby={`faq-question-${index}`}
                                            >
                                                <p className={`px-6 pb-6 ${theme.textMuted}`}>{faq.answer}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 lg:py-32" aria-labelledby="cta-heading">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative rounded-3xl overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradientBg}`} />
                            <motion.div
                                className="absolute inset-0 bg-[url('/security-bg.jpg')] opacity-10 bg-cover bg-center"
                                animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
                                transition={{ duration: 20, repeat: Infinity }}
                            />
                            <div className="relative px-6 py-12 lg:px-12 lg:py-20 text-center">
                                <motion.div animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                    <Shield className="w-16 h-16 mx-auto mb-6 opacity-90 text-white" aria-hidden="true" />
                                </motion.div>
                                <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">Ready to secure your files?</h2>
                                <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                                    Join thousands of organizations that trust Secura with their most sensitive data.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <motion.a
                                        href="https://secura-seven.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center gap-2 shadow-xl"
                                        aria-label="Open Secura for free"
                                    >
                                        Open Free
                                        <motion.span animate={prefersReducedMotion ? {} : { x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                            <ArrowRight className="w-5 h-5" aria-hidden="true" />
                                        </motion.span>
                                    </motion.a>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => addToast('info', 'Contact form coming soon!')}
                                        className="text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all"
                                        aria-label="Contact sales team"
                                    >
                                        Contact Sales
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className={`border-t ${theme.border} py-12 lg:py-16`} role="contentinfo">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center`}>
                                <Shield className="w-5 h-5 text-white" aria-hidden="true" />
                            </div>
                            <span className="text-xl font-bold">Secura</span>
                        </div>
                        <p className={`${theme.textMuted} text-sm`}>© 2024 Secura. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            {['HIPAA', 'GDPR', 'SOC 2'].map(cert => (
                                <span key={cert} className={`${theme.textMuted} text-sm`}>{cert}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Overlays */}
            <BackToTop />
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            <AnimatePresence>
                {showTour && <FeatureTour darkMode={darkMode} onClose={closeTour} />}
            </AnimatePresence>
        </div>
    );
}