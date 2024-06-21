import React, { useState, useEffect } from "react";
import "./style.css";
import database from '../firebase';
import { ref, set } from 'firebase/database';

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    surveyTopic: "",
    techSection: {
      favProgrammingLanguage: "",
      yearsOfExperience: "",
    },
    healthSection: {
      exerciseFrequency: "",
      dietPreference: "",
    },
    educationSection: {
      highestQualification: "",
      fieldOfStudy: "",
    },
    feedback: "",
  });

  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name.includes("techSection")) {
      setFormData({
        ...formData,
        techSection: {
          ...formData.techSection,
          [name.split(".")[1]]: value,
        },
      });
    } else if (name.includes("healthSection")) {
      setFormData({
        ...formData,
        healthSection: {
          ...formData.healthSection,
          [name.split(".")[1]]: value,
        },
      });
    } else if (name.includes("educationSection")) {
      setFormData({
        ...formData,
        educationSection: {
          ...formData.educationSection,
          [name.split(".")[1]]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      fetchAdditionalQuestions(formData.surveyTopic);
      saveToDatabase();
      setShowSummary(true);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.surveyTopic) {
      errors.surveyTopic = "Survey Topic is required";
    }
    if (formData.surveyTopic === "Technology") {
      if (!formData.techSection.favProgrammingLanguage) {
        errors.favProgrammingLanguage =
          "Favorite Programming Language is required";
      }
      if (!formData.techSection.yearsOfExperience) {
        errors.yearsOfExperience = "Years of Experience is required";
      }
    } else if (formData.surveyTopic === "Health") {
      if (!formData.healthSection.exerciseFrequency) {
        errors.exerciseFrequency = "Exercise Frequency is required";
      }
      if (!formData.healthSection.dietPreference) {
        errors.dietPreference = "Diet Preference is required";
      }
    } else if (formData.surveyTopic === "Education") {
      if (!formData.educationSection.highestQualification) {
        errors.highestQualification = "Highest Qualification is required";
      }
      if (!formData.educationSection.fieldOfStudy) {
        errors.fieldOfStudy = "Field of Study is required";
      }
    }
    if (!formData.feedback.trim() || formData.feedback.length < 50) {
      errors.feedback =
        "Feedback is required and must be at least 50 characters";
    }
    return errors;
  };

  const fetchAdditionalQuestions = (topic) => {
    let questions = [];
    if (topic === "Technology") {
      questions = ["Question 1 for Technology", "Question 2 for Technology"];
    } else if (topic === "Health") {
      questions = ["Question 1 for Health", "Question 2 for Health"];
    } else if (topic === "Education") {
      questions = ["Question 1 for Education", "Question 2 for Education"];
    }
    setAdditionalQuestions(questions);
  };

  const saveToDatabase = () => {
    const newSurveyRef = ref(database, 'surveys/' + new Date().getTime());
    set(newSurveyRef, formData)
      .then(() => console.log("Data saved successfully!"))
      .catch((error) => console.log("Error saving data: ", error));
  };

  useEffect(() => {
    setErrors({});
  }, [formData]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
        {errors.fullName && <p className="error">{errors.fullName}</p>}

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label htmlFor="surveyTopic">Survey Topic:</label>
        <select
          id="surveyTopic"
          name="surveyTopic"
          value={formData.surveyTopic}
          onChange={handleInputChange}
          required
        >
          <option value="">Select...</option>
          <option value="Technology">Technology</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
        </select>
        {errors.surveyTopic && <p className="error">{errors.surveyTopic}</p>}

        {formData.surveyTopic === "Technology" && (
          <div className="section">
            <label htmlFor="favProgrammingLanguage">
              Favorite Programming Language:
            </label>
            <select
              id="favProgrammingLanguage"
              name="techSection.favProgrammingLanguage"
              value={formData.techSection.favProgrammingLanguage}
              onChange={handleInputChange}
              required
            >
              <option value="">Select...</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C#">C#</option>
            </select>
            {errors.favProgrammingLanguage && (
              <p className="error">{errors.favProgrammingLanguage}</p>
            )}

            <label htmlFor="yearsOfExperience">Years of Experience:</label>
            <input
              type="number"
              id="yearsOfExperience"
              name="techSection.yearsOfExperience"
              value={formData.techSection.yearsOfExperience}
              onChange={handleInputChange}
              required
            />
            {errors.yearsOfExperience && (
              <p className="error">{errors.yearsOfExperience}</p>
            )}
          </div>
        )}

        {formData.surveyTopic === "Health" && (
          <div className="section">
            <label htmlFor="exerciseFrequency">Exercise Frequency:</label>
            <select
              id="exerciseFrequency"
              name="healthSection.exerciseFrequency"
              value={formData.healthSection.exerciseFrequency}
              onChange={handleInputChange}
              required
            >
              <option value="">Select...</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Rarely">Rarely</option>
            </select>
            {errors.exerciseFrequency && (
              <p className="error">{errors.exerciseFrequency}</p>
            )}

            <label htmlFor="dietPreference">Diet Preference:</label>
            <select
              id="dietPreference"
              name="healthSection.dietPreference"
              value={formData.healthSection.dietPreference}
              onChange={handleInputChange}
              required
            >
              <option value="">Select...</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>
            {errors.dietPreference && (
              <p className="error">{errors.dietPreference}</p>
            )}
          </div>
        )}

        {formData.surveyTopic === "Education" && (
          <div className="section">
            <label htmlFor="highestQualification">Highest Qualification:</label>
            <select
              id="highestQualification"
              name="educationSection.highestQualification"
              value={formData.educationSection.highestQualification}
              onChange={handleInputChange}
              required
            >
              <option value="">Select...</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
            </select>
            {errors.highestQualification && (
              <p className="error">{errors.highestQualification}</p>
            )}

            <label htmlFor="fieldOfStudy">Field of Study:</label>
            <input
              type="text"
              id="fieldOfStudy"
              name="educationSection.fieldOfStudy"
              value={formData.educationSection.fieldOfStudy}
              onChange={handleInputChange}
              required
            />
            {errors.fieldOfStudy && (
              <p className="error">{errors.fieldOfStudy}</p>
            )}
          </div>
        )}

        <label htmlFor="feedback">Feedback:</label>
        <textarea
          id="feedback"
          name="feedback"
          value={formData.feedback}
          onChange={handleInputChange}
          required
          minLength={50}
        ></textarea>
        {errors.feedback && <p className="error">{errors.feedback}</p>}
        
        <button type="submit">Submit</button>
      </form>

      {showSummary && (
        <div className="summary">
          <h3>Summary of Entered Data:</h3>
          <p><strong>Full Name:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Survey Topic:</strong> {formData.surveyTopic}</p>
          {formData.surveyTopic === "Technology" && (
            <>
              <p><strong>Favorite Programming Language:</strong> {formData.techSection.favProgrammingLanguage}</p>
              <p><strong>Years of Experience:</strong> {formData.techSection.yearsOfExperience}</p>
            </>
          )}
          {formData.surveyTopic === "Health" && (
            <>
              <p><strong>Exercise Frequency:</strong> {formData.healthSection.exerciseFrequency}</p>
              <p><strong>Diet Preference:</strong> {formData.healthSection.dietPreference}</p>
            </>
          )}
          {formData.surveyTopic === "Education" && (
            <>
              <p><strong>Highest Qualification:</strong> {formData.educationSection.highestQualification}</p>
              <p><strong>Field of Study:</strong> {formData.educationSection.fieldOfStudy}</p>
            </>
          )}
          <p><strong>Feedback:</strong> {formData.feedback}</p>
        </div>
      )}

      {additionalQuestions.length > 0 && (
        <div className="additional-questions">
          <h3>Additional Questions:</h3>
          <ul>
            {additionalQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SurveyForm;

