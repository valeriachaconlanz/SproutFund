import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import glossaryMeta from "../assets/glossaryTerm";
import "./Glossary.css";

function Glossary() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");

  // Term/definition text is translated; topic/level stay as the English keys from
  // glossaryTerm.js so filtering logic doesn't depend on the active language.
  // (t's reference already changes on language switch, so it alone is a sufficient dep.)
  const glossaryTerms = useMemo(() => {
    const translated = t("glossary.terms", { returnObjects: true });
    return glossaryMeta.map((item) => ({ ...item, ...translated[item.id] }));
  }, [t]);

  const topics = useMemo(
    () => [
      "All",
      ...new Set(glossaryMeta.map((item) => item.topic)),
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

  return (
    <main className="glossary-page">
      <section className="glossary-hero">
        <p className="glossary-label">{t('glossary.label')}</p>
        <h1>{t('glossary.title')}</h1>
        <p className="glossary-description">
          {t('glossary.description')}
        </p>


        <div className="glossary-search-card">
          <input
            type="text"
            placeholder={t('glossary.searchPlaceholder')}
            aria-label={t('glossary.searchAriaLabel')}
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
              {topic === "All" ? t('glossary.allTopics') : t(`glossary.topics.${topic}`)}
            </button>
          ))}
        </div>
      </section>

      {alphabetLetters.length > 0 && (
        <nav className="glossary-alphabet" aria-label={t('glossary.alphabetNavAriaLabel')}>
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
                    id={`term-${item.slug}`}
                    key={item.id}
                  >
                    <div className="glossary-card-header">
                      <h3>{item.term}</h3>

                      <div className="glossary-tags">
                        <span>{t(`glossary.levels.${item.level}`)}</span>
                        <span>{t(`glossary.topics.${item.topic}`)}</span>
                      </div>
                    </div>

                    <p>{item.definition}</p>
                  </article>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="glossary-empty">{t('glossary.empty')}</p>
        )}
      </section>
    </main>
  );
}

export default Glossary;
