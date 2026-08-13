// app\(auth)\sign-up\[[...sign-up]]\page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-outer_space-600 px-4">
			<div className="w-full max-w-md flex flex-col items-center">
				<div className="text-center mb-6">
					<h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500 mb-2">
						Create an Account
					</h1>
					<p className="text-payne's_gray-500 dark:text-french_gray-400">
						Join ProjectFlow to manage your capstone projects
					</p>
				</div>

				{/* Real Clerk Sign-Up Component */}
				<SignUp />
			</div>
		</div>
	);
}
