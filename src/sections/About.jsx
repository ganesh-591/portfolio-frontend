
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    ArrowUpRight,
    Code2,
    GraduationCap,
    Layers3,
    FileText
} from "lucide-react";

import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const focusAreas = [
    {
        number: "01",
        icon: Code2,
        title: "Backend Development",
        description:
            "Building REST APIs and backend applications using Java and Spring Boot."
    },
    {
        number: "02",
        icon: Layers3,
        title: "Full-Stack Development",
        description:
            "Creating responsive web applications with React, Java and MySQL."
    },
    {
        number: "03",
        icon: GraduationCap,
        title: "Continuous Learning",
        description:
            "Exploring modern technologies and sharpening problem-solving skills."
    }
];

const education = [
    {
        year: "2021 — 2025",
        title: "B.Tech in Computer Science",
        college: "DNR College of Engineering and Technology",
        score: "CGPA · 7.6 / 10"
    },
    {
        year: "2019 — 2020",
        title: "Intermediate · MPC",
        college: "Sri Chaitanya Junior College",
        score: "92.5%"
    },
    {
        year: "SSC",
        title: "10th Class",
        college: "Akshara School, Razole",
        score: "Secondary School Certificate"
    }
];

export default function About() {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) return;

        const ctx = gsap.context(() => {
            const heading = section.querySelector(".about-heading");
            const intro = section.querySelector(".about-intro");
            const educationCard = section.querySelector(".about-education");
            const focus = section.querySelector(".about-focus");
            const focusCards = section.querySelectorAll(".focus-card");

            gsap.fromTo(
                heading,
                { y: 65, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            gsap.fromTo(
                [intro, educationCard],
                { y: 70, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.18,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: intro,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            gsap.fromTo(
                focus,
                { y: 65, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: focus,
                        start: "top 88%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            gsap.fromTo(
                focusCards,
                { y: 45, opacity: 0, scale: 0.96 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.75,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: focusCards[0],
                        start: "top 88%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            className="about-section"
            id="about"
            aria-label="About"
            ref={sectionRef}
        >
            <div className="about-container">

                <div className="about-topline">
                    <span>ABOUT ME</span>
                    <span>GET TO KNOW ME</span>
                </div>

                <div className="about-glass-panel">

                    <div className="about-heading">
                        <p className="about-eyebrow">
                            A LITTLE INTRODUCTION
                        </p>

                        <h2>
                            MORE THAN
                            <br />
                            JUST <span>CODE.</span>
                        </h2>
                    </div>

                    <div className="about-main-grid">

                        <div className="about-intro about-glass-card">
                            <span className="about-label">WHO I AM</span>

                            <p className="about-description">
                                I'm <strong>Ganesh Kopparthi</strong>, a Computer
                                Science graduate and aspiring Java Full-Stack
                                Developer. I enjoy turning ideas into practical
                                digital solutions through clean code,
                                thoughtful design and problem-solving.
                            </p>

                            <p className="about-description secondary">
                                My primary focus is building backend
                                applications with Java and Spring Boot,
                                while using React to craft engaging user
                                experiences. I'm always curious to learn,
                                experiment and build something better.
                            </p>

                            <div className="about-actions-cluster">
                                <a
                                    href="#projects"
                                    className="about-project-link"
                                    aria-label="Explore my projects"
                                    data-cursor="VIEW"
                                >
                                    EXPLORE MY WORK
                                    <ArrowUpRight size={17} />
                                </a>

                                <a
                                    href="/resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="about-resume-link"
                                    aria-label="View Ganesh Kopparthi's Resume in a new browser tab"
                                    data-cursor="RESUME"
                                >
                                    <FileText size={15} />
                                    <span>VIEW RESUME</span>
                                    <ArrowUpRight size={13} />
                                </a>
                            </div>
                        </div>

                        <div className="about-education about-glass-card">
                            <div className="about-education-header">
                                <span className="about-label">
                                    EDUCATION
                                </span>
                                <span className="education-count">
                                    03 QUALIFICATIONS
                                </span>
                            </div>

                            {education.map((item, index) => (
                                <article
                                    className="education-card"
                                    key={item.title}
                                >
                                    <div className="education-card-top">
                                        <span className="education-year">
                                            {item.year}
                                        </span>
                                        <span className="education-number">
                                            0{index + 1}
                                        </span>
                                    </div>

                                    <h3>{item.title}</h3>
                                    <p>{item.college}</p>

                                    <span className="education-score">
                                        {item.score}
                                    </span>
                                </article>
                            ))}
                        </div>

                    </div>

                    <div className="about-focus">

                        <div className="focus-heading">
                            <span className="about-label">
                                WHAT I FOCUS ON
                            </span>
                            <span className="focus-caption">
                                MY TECHNICAL INTERESTS
                            </span>
                        </div>

                        <div className="focus-grid">
                            {focusAreas.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <article
                                        className="focus-card"
                                        key={item.number}
                                    >
                                        <div className="focus-card-top">
                                            <span>{item.number}</span>
                                            <Icon
                                                size={22}
                                                strokeWidth={1.5}
                                            />
                                        </div>

                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>

                                        <ArrowUpRight
                                            className="focus-arrow"
                                            size={18}
                                        />
                                    </article>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
