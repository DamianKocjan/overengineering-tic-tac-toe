export function Shimmer() {
	return (
		<div className="animate-pulse flex flex-col space-y-4">
			<div className="h-6 bg-gray-500 bg-opacity-25 rounded-lg w-1/2"></div>
			<div className="h-6 bg-gray-500 bg-opacity-25 rounded-lg w-2/3"></div>
			<div className="h-6 bg-gray-500 bg-opacity-25 rounded-lg w-5/6"></div>
		</div>
	);
}
