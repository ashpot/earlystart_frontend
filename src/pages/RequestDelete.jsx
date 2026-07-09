
import React, { useState } from 'react';
import logoIcon from '../assets/images/earlystartlogo.png';
import Footer from '../components/landing/Footer';


// H1 for main section titles
const H1 = ({ children }) => (
    <h1 className="text-4xl font-bold mt-12 mb-6 text-[#1E1E1E]">{children}</h1>
);

// H2 for sub-section titles 
const H2 = ({ children }) => (
    <h2 className="text-2xl font-bold mt-8 mb-4 ">{children}</h2>
);

// P for all paragraphs
const P = ({ children }) => (
    <p className="text-lg font-bold mb-6 leading-relaxed">{children}</p> 
);

// UL for bullet-point lists
const UL = ({ children, className }) => (
    <ul className={`list-disc list-inside space-y-2 mb-6 ml-4 text-lg ${className}`}>
        {children}
    </ul>
);


const RequestDelete = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [note, setNote] = useState('');

    const NotificationBox = ({ children, type = 'note' }) => {
        let classes = "p-4 my-6 rounded-lg text-lg border-l-4 ";
        if (type === 'note') {
            classes += "bg-[#fff8f8] border-[#d64545] text-[#6b0d0d]";
        } else if (type === 'success') {
            classes += "bg-[#f3fdf7] border-[#16a34a] text-[#03543f]";
        }
        return <div className={classes}>{children}</div>;
    };
    
    const Button = ({ children, variant = 'primary', ...props }) => {
        let classes = "px-6 py-3 rounded-xl font-bold transition duration-150 text-lg cursor-pointer ";
        
        if (variant === 'danger') {
            classes += "bg-[#d64545] hover:bg-red-700 text-white";
        } else if (variant === 'muted') {
            classes += "bg-[#eef2ff] hover:bg-indigo-50 text-[#0056d6]";
        } else if (variant === 'support') {
            classes += "bg-[#eef6ff] hover:bg-blue-50 text-[#0056d6]";
        }
        
        return <button className={classes} {...props}>{children}</button>;
    };

    return (
        <div className="bg-white min-h-screen text-[#1E1E1E]">
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-8'>
                <a href='/' className='flex items-center space-x-4'>
                    <img src={logoIcon} alt="Logo Icon" className='w-auto' />
                    
                </a>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                
                <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-6 mt-6">Request Account Deletion</h1>
                <p className="text-xl font-medium mb-10">
                    We're sorry to see you go. This page explains what happens when you delete your Earlystart account and guides you through the safe, verified process.
                </p>

                <H1>What Deleting Your Account Means</H1>
                <P>
                    Account deletion is permanent and irreversible. Please review the consequences below before proceeding with your request.
                </P>
                <UL className="text-[#1E1E1E] font-medium">
                    <li>Your <strong>profile, personal information, and transaction history</strong> will be removed from active systems.</li>
                    <li>Your <strong>wallet balance must be zero</strong> before deletion — withdraw any remaining funds first.</li>
                    <li>Some records may be retained in limited, anonymized form to meet legal or regulatory obligations.</li>
                    <li>Deletion is <strong>permanent</strong> — you cannot recover the account after completion.</li>
                </UL>

                <H1>Quick Checklist Before Requesting Deletion</H1>
                <P>
                    Ensure you have completed these steps to avoid issues with the deletion process:
                </P>
                <UL className="text-[#1E1E1E] font-medium">
                    <li>Withdraw any remaining wallet balance to your registered bank account.</li>
                    <li>Cancel recurring services, scheduled payments or subscriptions in the app.</li>
                    <li>Export or download any receipts or transaction history you want to keep.</li>
                    <li>Ensure you can receive verification (SMS or email) on the methods linked to your account.</li>
                </UL>

                <H1>Request Account Deletion (In-App)</H1>
                <P>
                    Complete the form below to request deletion. You will be asked to confirm your identity and provide a verification code sent to your phone or email.
                </P>
                
                <form 
                    className="p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-200"
                    onSubmit={(e) => e.preventDefault()} 
                >
                    <H2>1. Verify Identity</H2>
                    <div className="flex flex-wrap gap-6 mb-4">
                        <div className="flex-1 min-w-[220px]">
                            <label htmlFor="email" className="block font-semibold mb-2 text-sm text-[#1E1E1E]">Registered Email</label>
                            <input 
                                id="email" 
                                name="email" 
                                type="email" 
                                placeholder="you@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-[#0056d6] focus:border-[#0056d6]"
                            />
                            <div className="text-sm text-[#6b7280] mt-1.5">We will use this to verify your identity.</div>
                        </div>
                        <div className="flex-1 min-w-[220px]">
                            <label htmlFor="phone" className="block font-semibold mb-2 text-sm text-[#1E1E1E]">Registered Phone</label>
                            <input 
                                id="phone" 
                                name="phone" 
                                type="text" 
                                placeholder="+2348012345678" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-[#0056d6] focus:border-[#0056d6]"
                            />
                            <div className="text-sm text-[#6b7280] mt-1.5">SMS verification will be sent here.</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block font-semibold mb-2 text-sm text-[#1E1E1E]">Enter Password (or PIN)</label>
                        <input 
                            id="password" 
                            name="password" 
                            type="password" 
                            placeholder="Enter your password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-[#0056d6] focus:border-[#0056d6]"
                        />
                        <div className="text-sm text-[#6b7280] mt-1.5">This confirms it's you making the request.</div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="note" className="block font-semibold mb-2 text-sm text-[#1E1E1E]">Optional note (why you're leaving)</label>
                        <input 
                            id="note" 
                            name="note" 
                            type="text" 
                            placeholder="Optional feedback (helps us improve)" 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-[#0056d6] focus:border-[#0056d6]"
                        />
                    </div>

                    <NotificationBox type="note">
                        <span className="font-extrabold">Reminder:</span> Your wallet balance must be zero. If you have funds, withdraw them before requesting deletion.
                    </NotificationBox>

                    <div className="flex gap-4 items-center justify-center mt-8">
                        <Button variant="muted" type="submit">
                            Request Account Deletion
                        </Button>
                        <a 
                            href="mailto:support@Earlystart.com?subject=Account Deletion Assistance"
                            className="text-center"
                        >
                            <Button variant="support" as="a">
                                Contact Support
                            </Button>
                        </a>
                    </div>

                    <div className="mt-4 text-xs text-center text-[#6b7280]">
                        By requesting account deletion you agree to our data retention policy. For urgent requests, email <strong>support@Earlystart.com</strong>.
                    </div>
                </form>

                <H1>If You Cannot Access The App</H1>
                <P>
                    If you are unable to use the form above (e.g., forgotten password, lost phone), you can send an email request.
                </P>

                <H2>Email Request Requirements</H2>
                <P>
                    Email us from your registered email address with the subject <strong>Account Deletion Request — [Your Full Name]</strong> and include:
                </P>
                <UL className="text-[#1E1E1E] font-medium">
                    <li>Registered phone number and email.</li>
                    <li>Last 4 digits of the bank account used for withdrawals (if available).</li>
                    <li>A clear statement that you want your account permanently deleted.</li>
                </UL>
                <P>
                    Send to: <strong>support@Earlystart.com</strong>. We will verify your identity and reply with next steps (may take up to 3 business days).
                </P>

                <H1>Verification & Timeframes</H1>
                <UL className="text-[#1E1E1E] font-medium">
                    <li>In-app requests: verification code sent via SMS or email; deletion will be completed within <strong>24 hours</strong> after verification.</li>
                    <li>Email requests: verification and processing may take up to <strong>3 business days</strong>.</li>
                    <li>To cancel a pending deletion, reply to the verification email with <strong>"Cancel Deletion"</strong> within 24 hours.</li>
                </UL>

                <NotificationBox type="success">
                    Need help withdrawing funds before deletion? Contact support at <strong>support@Earlystart.com</strong> or call <strong>+234 911 2333 351</strong>.
                </NotificationBox>

            </main>
			<Footer />
        </div>
    );
}

export default RequestDelete;