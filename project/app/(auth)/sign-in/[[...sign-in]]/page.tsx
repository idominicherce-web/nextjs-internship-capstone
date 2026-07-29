import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-outer_space-600 px-4">
			<div className="w-full max-w-md flex flex-col items-center">
				<div className="text-center mb-6">
					<h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500 mb-2">
						Welcome Back
					</h1>
					<p className="text-payne's_gray-500 dark:text-french_gray-400">
						Sign in to your project management account
					</p>
				</div>

				{/* Real Clerk Sign-In Component */}
				<SignIn />
			</div>
		</div>
	);
}
