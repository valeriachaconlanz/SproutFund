import { useEffect, useMemo, useState } from "react";
import glossaryTerms from "../assets/glossaryTerm";
import "./Glossary.css";
// imports for highlighting the search term in the glossary definitions
import { useLocation } from "react-router-dom";


function Glossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  // Get the current location object from React Router
  const location = useLocation();


  const topics = useMemo(
    () => [
      "All",
      ...new Set(glossaryTerms.map((item) => item.topic)),
    ],
    []
  );

  const filteredTerms = glossaryTerms.filter((item) => {
    const matchesSearch = item.term
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesTopic =
      selectedTopic === "All" || item.topic === selectedTopic;

    return matchesSearch && matchesTopic;
  });

  const groupedTerms = filteredTerms.reduce((groups, item) => {
    const letter = item.term[0].toUpperCase();

    if (!groups[letter]) {
      groups[letter] = [];
    }

    groups[letter].push(item);
    return groups;
  }, {});

  const alphabetLetters = Object.keys(groupedTerms).sort();

  useEffect(() => {
  if (!location.hash) return;

  const id = location.hash.substring(1);

  // Wait until the glossary has rendered
  requestAnimationFrame(() => {
    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    element.classList.add("highlighted");

    setTimeout(() => {
      element.classList.remove("highlighted");
    }, 2000);
  });
}, [location]);

  return (
    <main className="glossary-page">
      <section className="glossary-hero">
        <p className="glossary-label">Learning Center</p>
        <h1>Investment Glossary</h1>
        <p className="glossary-description">
          Browse simple definitions for common investing terms used throughout SproutFund.
        </p>


        <div className="glossary-search-card">
          <input
            type="text"
            placeholder="Search investing terms..."
            aria-label="Search glossary terms"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="glossary-topic-row">
          {topics.map((topic) => (
            <button
              type="button"
              key={topic}
              className={`glossary-topic-pill ${
                selectedTopic === topic ? "active" : ""
              }`}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      {alphabetLetters.length > 0 && (
        <nav className="glossary-alphabet" aria-label="Glossary alphabet navigation">
          {alphabetLetters.map((letter) => (
            <a href={`#letter-${letter}`} key={letter}>
              {letter}
            </a>
          ))}
        </nav>
      )}

      <section className="glossary-list">
        {alphabetLetters.length > 0 ? (
          alphabetLetters.map((letter) => (
            <div className="glossary-group" id={`letter-${letter}`} key={letter}>
              <h2 className="glossary-letter">{letter}</h2>

              <div className="glossary-group-grid">
                {groupedTerms[letter].map((item) => (
                  <article
                    className="glossary-card"
                    id={`term-${item.term
                      .toLowerCase()
                      .replaceAll("&", "-and-")
                      .replaceAll(" ", "-")}`}
                    key={item.id}
                  >
                    <div className="glossary-card-header">
                      <h3>{item.term}</h3>

                      <div className="glossary-tags">
                        <span>{item.level}</span>
                        <span>{item.topic}</span>
                      </div>
                    </div>

                    <p>{item.definition}</p>
                  </article>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="glossary-empty">No glossary terms found. Try another search.</p>
        )}
      </section>
    </main>
  );
}

export default Glossary;
