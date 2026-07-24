function Hero() {
  return (
    <section className="bg-blue-600 text-white min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-5">
        <h1 className="text-6xl font-bold mb-5">
          RAMS BOYS HOSTEL
        </h1>

        <p className="text-2xl mb-3">
          Exclusive Hostel for VIT-AP University Students
        </p>

        <p className="text-lg mb-8">
          Comfortable • Secure • Student Friendly
        </p>

        <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-300">
          Book Now
        </button>
      </div>
    </section>
  );
}

export default Hero;