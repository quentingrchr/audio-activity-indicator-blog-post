import { motion } from "framer-motion";
const SoundWave = ({ isAnimating }: { isAnimating: boolean }) => {
  function getRandomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  return (
    <div className="w-10 h-10 bg-slate-500">
      <div className="flex justify-center items-center w-full h-full gap-[2px]">
        {[1, 2, 3, 4, 5, 6, 7].map((_, index) => {
          return (
            <motion.span
              key={index}
              className="block w-1 h-10 bg-white rounded-full"
              initial={{ scaleY: 0.5 }}
              animate={{
                scaleY: isAnimating ? 0.9 : 0,
                transition: {
                  delay:
                    index * getRandomInRange(0.1, 0.3) +
                    (index % 2 === 0 ? getRandomInRange(0.2, 0.6) : 0),
                  duration: getRandomInRange(0.2, 0.5),
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SoundWave;
