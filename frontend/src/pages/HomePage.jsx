function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white bg-opacity-80 rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 drop-shadow-lg text-center">Welcome hash to <span className="text-orange-500">StrayCare</span></h1>
        <p className="text-xl md:text-2xl font-semibold text-blue-500 mb-6 text-center">Join us in making a difference for stray animals. Report, help, and care for our furry friends!</p>
        <div className="flex justify-center mb-8">
          <img src="/dog.png" alt="Stray Dog" className="rounded-full shadow-xl w-60 h-60 object-cover border-4 border-blue-200 bg-white" />
        </div>
  <a href="/dashboard" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 text-lg">I Want to Help</a>
      </div>
      <div className="mt-10 text-center text-blue-700 text-lg font-medium">
        <span className="inline-block bg-white bg-opacity-60 rounded-xl px-6 py-3 shadow">StrayCare: Compassion in Action</span>
      </div>
    </div>
  );
}
export default HomePage;
