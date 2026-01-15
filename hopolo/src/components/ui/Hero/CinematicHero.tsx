import React from 'react';
import Button from '../Button/Button';
import styles from './CinematicHero.module.css';

interface CinematicHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  ctaText: string;
  onCtaClick: () => void;
}

const CinematicHero: React.FC<CinematicHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  onCtaClick,
}) => {
  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <Button
          variant="primary"
          className={styles.cta}
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      </div>
    </section>
  );
};

export default CinematicHero;
