import {
  motion,
  useTransform,
  useMotionValue,
  useAnimation,
  useDragControls,
} from "framer-motion";

import Image from "next/image";

export type TinderCard = {
  image: string;
  title: string;
  id: number;
  data: any;
};
type SwipeDirection = "left" | "right";

type TinderCardProps = {
  card: TinderCard;
  onSwipe: (direction: SwipeDirection, card: TinderCard) => void;
  onSkip: (card: TinderCard) => void;
  canSwipe?: boolean;
};

export const TinderCard = ({
  card,
  onSwipe,
  onSkip,
  canSwipe,
}: TinderCardProps) => {
  // To move the card as the user drags the cursor
  const motionValue = useMotionValue(0);

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

  const swipeX = (direction: SwipeDirection) => {
    let total_transition_time = 200;
    let newX = direction === "left" ? -200 : 200;
    animControls.start({
      x: newX,
      opacity: 0,
      transition: { duration: total_transition_time / 1000 },
    });
    if (!canSwipe) {
      // after half transition duration call the bounceBack function
      total_transition_time += 100;
      setTimeout(() => {
        bounceBack();
      }, 100);
    }
    // after transition duration call the onSwipe function
    setTimeout(() => {
      onSwipe(direction, card);
    }, total_transition_time);
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

  const bounceBack = () => {
    animControls.start({
      x: 0,
      opacity: 1,
      transition: { duration: 0.2 },
    });
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.1}
      onDragEnd={(event, info) => {
        if (info.offset.x > 150) {
          swipeX("right");
        } else if (info.offset.x < -150) {
          swipeX("left");
        } else {
          bounceBack();
        }
      }}
      animate={animControls}
      style={{
        opacity: opacityValue,
        rotate: rotateValue,
        x: motionValue,
        height: 500,
        width: 300,
        boxShadow: "0px 10px 18px #888888",
        borderRadius: 10,
        backgroundColor: backgroundColor,
      }}
    >
      <div className="flex items-center text-center text-black m-4 h-40">
        <h1 className="text-2xl font-bold">{card.title}</h1>
      </div>

      <div className="flex items-center justify-center m-4">
        <Image
          src={card.image || "/no_image_placeholder.png"}
          width={150}
          height={150}
        />
      </div>

      <div className="flex items-center justify-between m-4">
        <motion.div
          animate={nopeAnim}
          style={{
            opacity: nopeOpacity,
            fontSize: 30,
            color: "red",
          }}
        >
          Nope
        </motion.div>
        <motion.div
          animate={yepAnim}
          style={{
            opacity: yepOpacity,
            fontSize: 30,
            color: "green",
          }}
        >
          Yep
        </motion.div>
      </div>
      <div className="flex justify-between pt-4">
        <button
          onClick={() => swipeX("left")}
          className="btn btn-circle btn-error btn-lg hover:bg-opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          onClick={swipeUp}
          className="btn btn-circle btn-warning btn-lg hover:bg-opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
        <button
          onClick={() => swipeX("right")}
          className="btn btn-circle btn-success btn-lg hover:bg-opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};
