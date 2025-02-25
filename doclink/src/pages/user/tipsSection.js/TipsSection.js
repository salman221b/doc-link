import React from "react";
import "./TipsSection.css";
import diet from "../../../static/diet.png";
import sugar_salt from "../../../static/sugar_salt.png";
import hydration from "../../../static/hydration.png";
import fitness from "../../../static/fitness.png";
import smoking from "../../../static/smoking.png";
import sleep from "../../../static/sleep.png";

const TipsSection = () => {
  return (
    <div>
      <div className="marquee-container">
        <div className="marquee">
          <ul className="marquee-content text">
            <li>🧘 Stay Active & Exercise Daily</li>
            <li>🥗 Eat a Balanced Diet</li>
            <li>💧 Stay Hydrated</li>
            <li>😴 Get Enough Sleep</li>
            <li>🩺 Regular Health Check-ups</li>
          </ul>
        </div>
      </div>

      {/* --------------------------- */}
      <div class="card mb-3" style={{ maxWidth: "100%" }}>
        <div class="row g-0">
          <div class="col-md-4 ">
            <img src={diet} class="img-fluid rounded-start" alt="..." />
          </div>
          <div class="col-md-8 text">
            <div class="card-body">
              <h5 class="card-title ">Eat a Balanced Diet</h5>
              <p class="card-text ">
                Include a variety of foods in your diet, such as fruits,
                vegetables, whole grains, dairy, and protein. Aim for at least
                five portions of fruits and vegetables per day, which is about
                400 grams.
              </p>
              <p class="card-text ">
                <small>Last updated Just now</small>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* --------------------------- */}
      <div class="card mb-3" style={{ maxWidth: "100%" }}>
        <div class="row g-0">
          <div class="col-md-4 ">
            <img src={sugar_salt} class="img-fluid rounded-start" alt="..." />
          </div>
          <div class="col-md-8 text">
            <div class="card-body">
              <h5 class="card-title">Limit Sugar and Salt Intake</h5>
              <p class="card-text">
                Reduce your sugar intake to less than 10% of your total energy
                intake, and ideally to less than 5%. Also, limit your salt
                intake to 5 grams per day, equivalent to about one teaspoon.
              </p>
              <p class="card-text">
                <small>Last updated 2 mins ago</small>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* -------------------------------------- */}
      <div class="card mb-3" style={{ maxWidth: "100%" }}>
        <div class="row g-0">
          <div class="col-md-4">
            <img src={hydration} class="img-fluid rounded-start" alt="..." />
          </div>
          <div class="col-md-8 text">
            <div class="card-body">
              <h5 class="card-title">Stay Hydrated</h5>
              <p class="card-text">
                Drink plenty of fluids, aiming for at least 1.5 liters or 8
                glasses of water a day. This helps keep your body hydrated and
                supports various bodily functions.
              </p>
              <p class="card-text">
                <small>Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* -------------------------------------- */}
      <div class="card mb-3" style={{ maxWidth: "100%" }}>
        <div class="row g-0">
          <div class="col-md-4">
            <img src={fitness} class="img-fluid rounded-start" alt="..." />
          </div>
          <div class="col-md-8 text">
            <div class="card-body">
              <h5 class="card-title">Regular Physical Activity</h5>
              <p class="card-text">
                Engage in at least 150 minutes of moderate-intensity aerobic
                activity or 75 minutes of vigorous-intensity aerobic activity
                per week. This can include activities like brisk walking,
                cycling, or swimming.
              </p>
              <p class="card-text">
                <small>Last updated 5 mins ago</small>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* -------------------------------------- */}
      <div class="card mb-3" style={{ maxWidth: "100%" }}>
        <div class="row g-0">
          <div class="col-md-4">
            <img src={smoking} class="img-fluid rounded-start" alt="..." />
          </div>
          <div class="col-md-8 text">
            <div class="card-body">
              <h5 class="card-title">Avoid Smoking and Limit Alcohol</h5>
              <p class="card-text">
                Smoking and excessive alcohol consumption can lead to serious
                health problems. If you smoke, consider quitting. Limit your
                alcohol intake to moderate levels.
              </p>
              <p class="card-text">
                <small>Last updated 8 mins ago</small>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------- */}
      <div class="card mb-3" style={{ maxWidth: "100%" }}>
        <div class="row g-0">
          <div class="col-md-4 ">
            <img src={sleep} class="img-fluid rounded-start" alt="..." />
          </div>
          <div class="col-md-8 text">
            <div class="card-body">
              <h5 class="card-title">Quality Sleep</h5>
              <p class="card-text">
                Aim for 7-9 hours of quality sleep per night to support overall
                health and well-being.There are many strategies you can try to
                help yourself learn to sleep better. For starters, it can be
                helpful to establish a sleep routine. Then, you can work on
                making your environment more conducive to sleep, reducing light
                and noise close to bedtime, and limiting the foods and drinks
                you consume before you go to bed.
              </p>
              <p class="card-text">
                <small>Last updated 11 mins ago</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsSection;
