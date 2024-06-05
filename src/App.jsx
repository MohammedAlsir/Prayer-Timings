// import { useState } from 'react'
import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import "./App.css";
import Prayers from "./Components/Prayers";
import a from "./assets/fj.jpg";
import b from "./assets/duh.webp";
import c from "./assets/as.jpg";
import d from "./assets/mo.jpg";
import e from "./assets/isha.webp";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";

moment.locale("ar"); // ar-dz

function App() {
  const listPrayers = [
    {
      key: "Fajr",
      displayName: "الفجر",
    },
    {
      key: "Dhuhr",
      displayName: "الظهر",
    },
    {
      key: "Asr",
      displayName: "العصر",
    },
    {
      key: "Maghrib",
      displayName: "المغرب",
    },
    {
      key: "Isha",
      displayName: "العشاء",
    },
  ];

  const [nextPrayerState, setNextPrayerState] = useState(0);
  const cities = [
    { displayName: "مكة المكرمة", apiName: "Makkah al Mukarramah", code: "sa" },
    { displayName: "الرياض", apiName: "Riyadh", code: "sa" },
    { displayName: "الخرطوم", apiName: "Khartoum", code: "sd" },
  ];

  const [city, setCity] = useState({
    displayName: "مكة المكرمة",
    apiName: "Makkah al Mukarramah",
    code: "sa",
  });

  const [today, setToday] = useState("");
  const [reminingTime, setReminingTime] = useState("");

  const handleChange = (event) => {
    // console.log(event.target)
    const cityObject = cities.find((city) => {
      return city.apiName === event.target.value;
    });
    setCity(cityObject);
  };

  const [times, setTimes] = useState("");
  async function getTimes() {
    const result = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity/19-05-2024?country=${city.code}&city=${city.apiName}`
    );
    setTimes(result.data.data.timings);
  }

  useEffect(() => {
    getTimes();
  }, [city]);

  useEffect(() => {
    setToday(moment().format("MMM Do YYYY | h:mm"));

    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [times]);

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let nextPrayerIndex = null;

    // بعد after
    // قبل befor
    if (
      momentNow.isAfter(moment(times["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(times["Dhuhr"], "hh:mm"))
    ) {
      nextPrayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(times["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(times["Asr"], "hh:mm"))
    ) {
      nextPrayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(times["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(times["Maghrib"], "hh:mm"))
    ) {
      nextPrayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(times["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(times["Isha"], "hh:mm"))
    ) {
      nextPrayerIndex = 4;
    } else {
      nextPrayerIndex = 0;
    }

    setNextPrayerState(nextPrayerIndex);
    // console.log(moment(times[listPrayers[nextPrayerIndex]], "hh:mm"));

    // Timing
    const nextPrayerObject = listPrayers[nextPrayerIndex]; //الصلاة القادمة -- الظهر
    const nextPrayerTimer = times[nextPrayerObject.key]; // زمن الصلاة القادمة
    // const remaingTime = momentNow.diff(moment(nextPrayerTimer, "hh:mm"));
    let remaingTime = moment(nextPrayerTimer, "hh:mm").diff(momentNow);

    if (remaingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimer.diff(moment("00:00:00", "hh:mm:ss"));

      const totalDiff = midnightDiff + fajrToMidnightDiff;

      remaingTime = totalDiff;
    }

    const duration = moment.duration(remaingTime);
    setReminingTime(duration.hours() + " : " + duration.minutes() + " : " + duration.seconds());
    // setReminingTime(duration.seconds() + ":" + duration.minutes() + ":" + duration.hours());

    console.log(duration.hours() + " : " + duration.minutes() + " : " + duration.seconds());
    // console.log(moment(nextPrayerTimer, "hh:mm"));
    // console.log(duration.hours() + " " + duration.minutes() + " " + duration.seconds());
  };

  return (
    <div className="app">
      <div className="main">
        <div>
          <p>{today}</p>
          <h2>{city.displayName}</h2>
        </div>
        <div>
          <p>متبقي حتي صلاة {listPrayers[nextPrayerState].displayName}</p>
          <h2 style={{ direction: "ltr" }}>{reminingTime}</h2>
        </div>

        <div className="select">
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={city.displayName}
              label="المدينة"
              onChange={handleChange}
            >
              {cities.map((city, index) => {
                return (
                  <MenuItem key={index} value={city.apiName}>
                    {city.displayName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </div>
      {/* <CardMain /> */}
      <hr />
      <div className="cards">
        <Prayers img={a} name="الفجر" time={times.Fajr} />
        <Prayers img={b} name="الظهر" time={times.Dhuhr} />
        <Prayers img={c} name="العصر" time={times.Asr} />
        <Prayers img={d} name="المغرب" time={times.Maghrib} />
        <Prayers img={e} name="العشاء" time={times.Isha} />
      </div>
    </div>
  );
}

export default App;
