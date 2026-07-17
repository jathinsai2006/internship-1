function StatsCards({ document }) {

  if (!document) return null;

  const cards = [
    {
      title: "Pages",
      value: document.pages,
      icon: "📄",
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Chunks",
      value: document.chunk_count,
      icon: "✂️",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Characters",
      value: document.characters,
      icon: "📝",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Vector DB",
      value: "ChromaDB",
      icon: "💾",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      {cards.map((card, index) => (

        <div
          key={index}
          className={`bg-gradient-to-r ${card.color} rounded-2xl p-6 shadow-xl hover:scale-105 transition`}
        >

          <div className="text-5xl">
            {card.icon}
          </div>

          <h3 className="mt-5 text-xl font-semibold">
            {card.title}
          </h3>

          <p className="mt-2 text-3xl font-bold">
            {card.value}
          </p>

        </div>

      ))}

    </div>
  );

}

export default StatsCards;