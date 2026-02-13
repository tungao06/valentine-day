import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ValentineCountdown = () => {
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(0);

  const [day, setDay] = useState(0);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);

  const countDownDate = new Date("2023-02-22T22:22:00").getTime(); // วันครบรอบ

  useEffect(() => {
    const interval = setInterval(() => {
      let today = new Date().getTime();
      let distance = today - countDownDate;

      // คำนวณปีจากการหารจำนวนวันทั้งหมดโดยใช้ 365.25 วัน (รองรับปีอธิกสุรทิน)
      const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365.25));

      // คำนวณเดือนจากจำนวนวันที่เหลือหลังจากหาปี
      const months = Math.floor(
        (distance % (1000 * 60 * 60 * 24 * 365.25)) /
          (1000 * 60 * 60 * 24 * 30.44)
      ); // 30.44 วันเฉลี่ยต่อเดือน

      // คำนวณวันจากจำนวนวันที่เหลือหลังจากหาปีและเดือน
      const days = Math.floor(
        (distance % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)
      );

      // คำนวณชั่วโมง, นาที, วินาที
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Update state
      setYear(years);
      setMonth(months);
      setDay(days);
      setHour(hours);
      setMinute(minutes);
      setSecond(seconds);

      // Stop the countdown when the target date is reached
      if (distance <= 0) {
        clearInterval(interval);
        setYear(0);
        setMonth(0);
        setDay(0);
        setHour(0);
        setMinute(0);
        setSecond(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -100 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.3,
            type: "spring",
            visualDuration: 0.5,
            bounce: 0.8,
          },
        }}
        exit={{ opacity: 0, y: 100 }}
        className="sm:text-4xl text-2xl text-center font-semibold mb-10 pt-7"
      >
        ANNIVERSARY, MY HONEY
      </motion.h2>
      <div className="flex justify-around flex-wrap text-center gap-4 sm:gap-8 [&>*>motion.h2]:text-xl [&>*>motion.h2]:sm:text-4xl [&>*>motion.h2]:font-bold [&>*>p]:text-lg [&>*>p]:font-semibold">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.4,
              },
            }}
            exit={{ opacity: 0, y: -50 }}
            id="year"
          >
            {year}
          </motion.h2>
          <p>Year</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.4,
              },
            }}
            exit={{ opacity: 0, y: -50 }}
            id="month"
          >
            {month}
          </motion.h2>
          <p>Month</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.4,
              },
            }}
            exit={{ opacity: 0, y: -50 }}
            id="day"
          >
            {day}
          </motion.h2>
          <p>days</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.4,
              },
            }}
            exit={{ opacity: 0, y: -50 }}
            id="hour"
          >
            {hour}
          </motion.h2>
          <p>Hours</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.4,
              },
            }}
            exit={{ opacity: 0, y: -50 }}
            id="minute"
          >
            {minute}
          </motion.h2>
          <p>Minutes</p>
        </div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                type: "spring",
                visualDuration: 0.3,
                bounce: 0.4,
              },
            }}
            exit={{ opacity: 0, y: -50 }}
            id="second"
          >
            {second}
          </motion.h2>
          <p>Seconds</p>
        </div>
      </div>
    </div>
  );
};

export default ValentineCountdown;
