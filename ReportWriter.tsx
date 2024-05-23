import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../AppContext';
import { AIWriterAPI } from "../api/AIWriterAPI";
import './ReportWriter.css';



const performanceSentences: { [key: string]: string } = {
  'needs improvement': 'needs to improve in this area',
  'meets expectations': 'meets the expected standards',
  'good student': 'shows good understanding and performance',
  'exceptional student': 'demonstrates exceptional skills and understanding'
};

const ReportWriter: React.FC = () => {
  
  const { contextVariable } = useAppContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false); 
  const [reportPeriod, setReportPeriod] = useState('Easter term 2024');
  const [studentName, setStudentName] = useState('Michael Smith');
  const [className, setClassName] = useState('9b Science');
  const [date, setDate] = useState('');
  const [topics, setTopics] = useState([{ name: 'state of matter, solid, liquids and gases', performance: 'meets expectations' }]);
  const [competencies, setCompetencies] = useState(
    [
      { name: 'Behaviour, concentration and listening', performance: 'meets expectations' },
      { name: 'Interacting and helping other students', performance: 'meets expectations' },
      { name: 'Contributing to class discussions', performance: 'meets expectations' },
  ]);
  const [layout, setLayout] = useState('basic');
  const [textAI, setTextAI] = useState('');

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]); // Sets the date to today
  }, []);

  const updateTopic = (index: number, text: string) => {
    const newTopics = [...topics];
    newTopics[index].name = text;
    setTopics(newTopics);
  };

  const updateCompetency = (index: number, text: string) => {
    const newCompetencies = [...competencies];
    newCompetencies[index].name = text;
    setCompetencies(newCompetencies);
  };

  const addTopicPerformance = (index: number, performance: string) => {
    const newTopics = [...topics];
    newTopics[index].performance = performance;
    setTopics(newTopics);
  };

  const addCompetencyPerformance = (index: number, performance: string) => {
    const newCompetencies = [...competencies];
    newCompetencies[index].performance = performance;
    setCompetencies(newCompetencies);
  };

  const addTopic = () => {
    setTopics([...topics, { name: 'material states, solid, liquids and gases', performance: 'meets expectations' }]);
  };

  const removeTopic = (index: number) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  const addCompetency = () => {
    setCompetencies([...competencies, { name: 'new competency', performance: 'meets expectations' }]);
  };

  const removeCompetency = (index: number) => {
    const newCompetencies = [...competencies];
    newCompetencies.splice(index, 1);
    setCompetencies(newCompetencies);
  };
  
  const isTopicPerformanceSelected = (topicIndex: number, performance: string) => {
    return topics[topicIndex].performance === performance;
  };

  const isCompetencyPerformanceSelected = (competencyIndex: number, performance: string) => {
    return competencies[competencyIndex].performance === performance;
  };

  const getAIWriter35 = async () => {
    setIsLoading(true);
    const AIResponse = await AIWriterAPI.postReport(studentName, className, competencies, topics, false);
    console.log('better report: ', AIResponse);
    setLayout('gpt35')
    setTextAI(AIResponse.report);
    setIsLoading(false); 
  };

  const getAIWriter4 = async () => {
    setIsLoading(true);
    const AIResponse = await AIWriterAPI.postReport(studentName, className, competencies, topics, true);
    console.log('AI report gpt4: ', AIResponse);
    setLayout('gpt4')
    setTextAI(AIResponse.report);
    setIsLoading(false);
  };

  const getBasicLayout = () => {
    setLayout('basic')
  };

  const isLayoutUsed = (layoutQueried: string) => {
    return layoutQueried === layout;
  };


  const copyTextToClipboard = async () => {
    const reportElement = document.querySelector('.report-container');
    if (reportElement instanceof HTMLElement) { // Type assertion
      const reportText = reportElement.innerText;
      try {
        await navigator.clipboard.writeText(reportText);
        console.log('Text copied to clipboard');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const paragraphs = textAI.split('\n\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
  

  return (
    <div className="app-content">
      {isLoading && (
        <div className="modal-overlay">
          <div className="spinner"></div>
          <h3>AI creating report</h3>
          <h3>please wait...</h3>
        </div>
      )}
      <div className="row align-items-center">
        <div className="col-4 d-flex justify-content-center align-items-center mb-3">
          <label className="input-field">
            Report Period
            <input type="text" className="form-control" value={reportPeriod} onChange={e => setReportPeriod(e.target.value)} />
          </label>
          <label className="input-field">
            Date
            <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
          </label>
        </div>
        <div className='col-4 d-flex justify-content-center align-items-center mb-3'>
          <h1 className="app-header">Student Report Writer</h1>
        </div>
        <div className="col-4 d-flex justify-content-center align-items-center mb-3">
          <label className="input-field">
            Class
            <input type="text" className="form-control" value={className} onChange={e => setClassName(e.target.value)} />
          </label>
          <label className="input-field">
            Student Name
            <input type="text" className="form-control" value={studentName} onChange={e => setStudentName(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="app-body">
        <div className="column px-3"> {/* Left Column */} 
          <h2>Competency Areas</h2>
          <div className="input-row">
            <div>
              {competencies.map((competency, index) => (
                <div key={index} className="mb-6">
                  <div className="comp-topic-area-container">
                    <input
                      type="text"
                      className="form-control mb-2 comp-topic-input"
                      value={competency.name}
                      onChange={e => updateCompetency(index, e.target.value)}
                      placeholder="Competency Area"
                    />
                    <i className="bi bi-trash" onClick={() => removeCompetency(index)}></i>
                  </div>
                  <div>
                    {Object.keys(performanceSentences).map((performanceKey) => (
                      <button
                        key={performanceKey}
                        className={`btn performance-button ${isCompetencyPerformanceSelected(index, performanceKey) ? 'btn-light' : 'btn-outline-secondary'}`}
                        onClick={() => addCompetencyPerformance(index, performanceKey)}
                      >
                        {performanceKey.replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn btn-primary mt-2" onClick={addCompetency}>Add Competency Area</button>
            </div>
          </div>
        </div>
        
        <div className="column"> {/* Middle Column */}
          <div className="report-container">
            <div className="text-center mb-5">
              <h4>Student Report - {reportPeriod} - {date}</h4>
              <h4>Class - {className}</h4>
              <h4>Student - {studentName}</h4>
            </div>

            {layout === 'basic' && (
              <>
                {topics.map((topic, index) => (
                  <p key={index}>
                    {studentName} has been learning about the topic area: {topic.name}. {studentName} {performanceSentences[topic.performance]}.
                  </p>
                ))}
                {competencies.map((competency, index) => (
                  <p key={index}>
                    {studentName} has been working on the competency area: {competency.name}. {studentName} {performanceSentences[competency.performance]}.
                  </p>
                ))}
              </>
            )}

            {layout !== 'basic' && (
              paragraphs
            )}
          </div>
          <div className="d-flex justify-content-around mt-3">
            <button className={`btn ${isLayoutUsed("basic") ? 'btn-light' : 'btn-outline-secondary'} fix-width-btn`} onClick={getBasicLayout}>
              <i className="bi bi-layout-text-window-reverse"></i> Basic Layout
            </button>
            <button className={`btn ${isLayoutUsed("gpt35") ? 'btn-light' : 'btn-outline-secondary'} fix-width-btn`} onClick={getAIWriter35}>
              <i className="bi bi-stars"></i> Better Layout
            </button>
            <button className="btn btn-primary fix-width-btn" onClick={copyTextToClipboard}>
              <i className="bi bi-clipboard"></i> Copy Text
            </button>
          </div>
        </div>

        <div className="column px-3"> {/* Right Column */}
          <h2>Topic Areas</h2>
          <div className="input-row">
            <div>
              {topics.map((topic, index) => (
                <div key={index} className="mb-6">
                  <div className="comp-topic-area-container">
                    <input
                      type="text"
                      className="form-control mb-2 comp-topic-input"
                      value={topic.name}
                      onChange={e => updateTopic(index, e.target.value)}
                      placeholder="Topic area"
                    />
                    <i className="bi bi-trash" onClick={() => removeTopic(index)}></i>
                  </div>
                  <div>
                    {Object.keys(performanceSentences).map((performanceKey) => (
                      <button
                        key={performanceKey}
                        className={`btn performance-button ${isTopicPerformanceSelected(index, performanceKey) ? 'btn-light' : 'btn-outline-secondary'}`}
                        onClick={() => addTopicPerformance(index, performanceKey)}
                      >
                        {performanceKey.replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn btn-primary mt-2" onClick={addTopic}>Add Topic Area</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportWriter;
