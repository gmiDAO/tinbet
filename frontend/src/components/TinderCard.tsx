import {
  motion,
  useTransform,
  useMotionValue,
  useAnimation,
  useDragControls,
} from "framer-motion";

export type TinderCard = {
  image: string;
  title: string;
  id: number;
  data: any;
};

type TinderCardProps = {
  card: TinderCard;
  onSwipe: (direction: "left" | "right", card: TinderCard) => void;
  onSkip: (card: TinderCard) => void;
};

export const TinderCard = ({ card, onSwipe, onSkip }: TinderCardProps) => {
  // To move the card as the user drags the cursor
  const motionValue = useMotionValue(0);
  const controls = useDragControls();

  // To rotate the card as the card moves on drag
  const rotateValue = useTransform(motionValue, [-200, 200], [-50, 50]);

  // To decrease opacity of the card when swiped
  // on dragging card to left(-200) or right(200)
  // opacity gradually changes to 0
  // and when the card is in center opacity = 1
  const opacityValue = useTransform(
    motionValue,
    [-200, -150, 0, 150, 200],
    [0, 1, 1, 1, 0]
  );

  const backgroundColor = useTransform(
    motionValue,
    [-100, 0, 100],
    ["#F87272", "#ffffff", "#609f62"]
  );

  // animations for the "Nope" and "Yep" text
  const nopeAnim = useAnimation();
  const yepAnim = useAnimation();

  // useTransform to control the animation based on motionValue
  const nopeOpacity = useTransform(motionValue, [-100, 0], [1, 0]);
  const yepOpacity = useTransform(motionValue, [100, 0], [1, 0]);

  // Framer animation hook
  const animControls = useAnimation();

  const swipeLeft = () => {
    animControls.start({
      x: -200,
      opacity: 0,
      transition: { duration: 0.2 },
    });
    // after transition duration call the onSwipe function
    setTimeout(() => {
      onSwipe("left", card);
    }, 200);
  };

  const swipeRight = () => {
    animControls.start({
      x: 200,
      opacity: 0,
      transition: { duration: 0.2 },
    });
    // after transition duration call the onSwipe function
    setTimeout(() => {
      onSwipe("right", card);
    }, 200);
  };

  const swipeUp = () => {
    animControls.start({
      y: -200,
      opacity: 0,
      transition: { duration: 0.2 },
    });
    // after transition duration call the skip function
    setTimeout(() => {
      onSkip(card);
    }, 200);
  };

  return (
    <div className="flex justify-center ">
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.1}
        onDragEnd={(event, info) => {
          if (info.offset.x > 150) {
            swipeRight();
          } else if (info.offset.x < -150) {
            swipeLeft();
          } else {
            animControls.start({
              x: 0,
              opacity: 1,
              transition: { duration: 0.2 },
            });
          }
        }}
        animate={animControls}
        style={{
          opacity: opacityValue,
          rotate: rotateValue,
          x: motionValue,
          height: 500,
          width: 300,
          boxShadow: "5px 10px 18px #888888",
          borderRadius: 10,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          margin: "50px 0",
          position: "absolute",
          backgroundColor: backgroundColor,
        }}
      >
        <div className="text-center text-black m-4">
          <h1 className="text-2xl font-bold">{card.title}</h1>
        </div>
        <div className="avatar flex justify-center">
          <div className="w-24 mask mask-squircle">
            <img src={card.image} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0 20px",
          }}
        >
          <motion.div
            animate={nopeAnim}
            style={{
              opacity: nopeOpacity,
              fontSize: 50,
              color: "red",
            }}
          >
            Nope
          </motion.div>
          <motion.div
            animate={yepAnim}
            style={{
              opacity: yepOpacity,
              fontSize: 50,
              color: "green",
            }}
          >
            Yep
          </motion.div>
        </div>
        <div className="flex justify-center">
          <button onClick={swipeLeft} className="btn btn-red">
            Nope
          </button>
          <button onClick={swipeUp} className="btn btn-red">
            Skip
          </button>
          <button onClick={swipeRight} className="btn btn-red">
            Yes
          </button>
        </div>
      </motion.div>
    </div>
  );
};
