import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import glossaryMeta from "../assets/glossaryTerm";
import { bounceSpring, duration, ease, resolveTransition, softSpring } from "../lib/motion";
import Reveal from "../components/Reveal";
import "./Glossary.css";

function Glossary() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();

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
              {/* The filled pill is one shared element that slides between
                  topics — same layoutId trick the navbar uses, so filtering
                  here feels like the same product as navigating there. */}
              {selectedTopic === topic && (
                <motion.span
                  layoutId="glossary-topic-pill-active"
                  className="glossary-topic-pill-bg"
                  transition={resolveTransition(bounceSpring, shouldReduceMotion)}
                />
              )}
              <span className="glossary-topic-pill-label">
                {topic === "All" ? t('glossary.allTopics') : t(`glossary.topics.${topic}`)}
              </span>
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

      {/* Groups and cards carry `layout`, so narrowing the filter reflows the
          list smoothly instead of the page snapping to a new arrangement.
          AnimatePresence handles the cards that drop out of the filter. */}
      <section className="glossary-list">
        {alphabetLetters.length > 0 ? (
          <AnimatePresence mode="popLayout" initial={false}>
            {alphabetLetters.map((letter) => (
              <motion.div
                className="glossary-group"
                id={`letter-${letter}`}
                key={letter}
                layout={!shouldReduceMotion}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={resolveTransition(softSpring, shouldReduceMotion)}
              >
                <h2 className="glossary-letter">{letter}</h2>

                <div className="glossary-group-grid">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {groupedTerms[letter].map((item) => (
                      <motion.article
                        className="glossary-card"
                        id={`term-${item.slug}`}
                        key={item.id}
                        layout={!shouldReduceMotion}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : duration.fast,
                          ease: ease.standard,
                        }}
                      >
                        <div className="glossary-card-header">
                          <h3>{item.term}</h3>

                          <div className="glossary-tags">
                            <span>{t(`glossary.levels.${item.level}`)}</span>
                            <span>{t(`glossary.topics.${item.topic}`)}</span>
                          </div>
                        </div>

                        <p>{item.definition}</p>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <Reveal as="p" className="glossary-empty">{t('glossary.empty')}</Reveal>
        )}
      </section>
    </main>
  );
}

export default Glossary;