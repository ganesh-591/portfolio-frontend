
import React, { useRef, useState, useLayoutEffect } from "react";
import {
    Mail,
    ArrowUpRight,
    MapPin,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

function GithubIcon({ size = 18, strokeWidth = 1.8, className = "" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );
}

function LinkedinIcon({ size = 18, strokeWidth = 1.8, className = "" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    );
}

export default function Contact() {
    const sectionRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: null, message: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        if (status.type) {
            setStatus({ type: null, message: "" });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Valid email is required";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message cannot be empty";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!validate()) return;

        setIsSubmitting(true);
        setStatus({ type: null, message: "" });

        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await fetch(`${API_URL}/api/v1/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    subject: formData.subject.trim(),
                    message: formData.message.trim()
                })
            });

            if (response.ok) {
                setStatus({
                    type: "success",
                    message: "Thank you! Your message has been sent successfully."
                });
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                });
                setErrors({});
            } else {
                let errorText = "Failed to send message. Please try again later.";
                try {
                    const data = await response.json();
                    if (data && (data.message || data.error)) {
                        errorText = data.message || data.error;
                    }
                } catch {
                    // Response not JSON
                }
                setStatus({
                    type: "error",
                    message: errorText
                });
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: "Network error: Unable to connect to the server. Please check your connection or reach out via email."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) return;

        const ctx = gsap.context(() => {
            const heading = section.querySelector(".contact-heading");
            const mainGrid = section.querySelector(".contact-main-grid");
            const footer = section.querySelector(".contact-footer-bar");

            if (heading) {
                gsap.fromTo(
                    heading,
                    { y: 55, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (mainGrid) {
                gsap.fromTo(
                    mainGrid,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: mainGrid,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (footer) {
                gsap.fromTo(
                    footer,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: footer,
                            start: "top 95%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }, section);

        return () => ctx.revert();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <section
            className="contact-section"
            id="contact"
            ref={sectionRef}
        >
            <div className="contact-container">

                <div className="contact-topline">
                    <span>05 / GET IN TOUCH</span>
                    <span>CONTACT &amp; COLLABORATION</span>
                </div>

                <div className="contact-heading">
                    <p className="contact-eyebrow">
                        HAVE A PROJECT OR OPPORTUNITY?
                    </p>

                    <h2>
                        LET'S
                        <br />
                        <span>CONNECT.</span>
                    </h2>
                </div>

                <div className="contact-main-grid">

                    {/* LEFT: Contact Form */}

                    <div className="contact-form-wrapper">

                        <p className="contact-form-intro">
                            I'm actively seeking opportunities to build
                            scalable backends, microservices, and
                            high-performance full stack web applications.
                            Send me a message directly below.
                        </p>

                        <form
                            className="contact-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <div className="form-group-row">

                                <div className={`form-field ${errors.name ? "has-error" : ""}`}>
                                    <label htmlFor="contact-name" className="form-label">
                                        Your Name
                                    </label>

                                    <input
                                        id="contact-name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Ganesh Kopparthi"
                                        className="form-input"
                                        aria-required="true"
                                    />

                                    {errors.name && (
                                        <span className="form-error-msg">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                <div className={`form-field ${errors.email ? "has-error" : ""}`}>
                                    <label htmlFor="contact-email" className="form-label">
                                        Your Email
                                    </label>

                                    <input
                                        id="contact-email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="form-input"
                                        aria-required="true"
                                    />

                                    {errors.email && (
                                        <span className="form-error-msg">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>

                            </div>

                            <div className={`form-field ${errors.subject ? "has-error" : ""}`}>
                                <label htmlFor="contact-subject" className="form-label">
                                    Subject
                                </label>

                                <input
                                    id="contact-subject"
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Backend Developer Opportunity / Project Inquiry"
                                    className="form-input"
                                    aria-required="true"
                                />

                                {errors.subject && (
                                    <span className="form-error-msg">
                                        {errors.subject}
                                    </span>
                                )}
                            </div>

                            <div className={`form-field ${errors.message ? "has-error" : ""}`}>
                                <label htmlFor="contact-message" className="form-label">
                                    Message
                                </label>

                                <textarea
                                    id="contact-message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell me about your team, project requirements, or timeline..."
                                    className="form-textarea"
                                    rows="5"
                                    aria-required="true"
                                />

                                {errors.message && (
                                    <span className="form-error-msg">
                                        {errors.message}
                                    </span>
                                )}
                            </div>

                            {status.message && (
                                <div
                                    className={`contact-status-banner ${status.type === "success"
                                            ? "is-success"
                                            : "is-error"
                                        }`}
                                    role="alert"
                                >
                                    {status.type === "success" ? (
                                        <CheckCircle2 size={16} />
                                    ) : (
                                        <AlertCircle size={16} />
                                    )}
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`contact-submit-btn ${isSubmitting ? "is-submitting" : ""}`}
                                disabled={isSubmitting}
                                data-cursor="SEND"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={15} className="contact-btn-spinner" />
                                ) : (
                                    <Send size={15} />
                                )}
                                <span>
                                    {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                                </span>
                            </button>

                        </form>
                    </div>

                    {/* RIGHT: Contact Details */}

                    <div className="contact-details-col">

                        <div className="contact-info-card">

                            <div className="contact-detail-row">
                                <span className="contact-row-label">
                                    DIRECT EMAIL
                                </span>

                                <a
                                    href="mailto:kopparthiganesh591@gmail.com"
                                    className="contact-row-value"
                                    data-cursor="EMAIL"
                                >
                                    <Mail size={16} />
                                    <span>kopparthiganesh591@gmail.com</span>
                                    <ArrowUpRight size={14} />
                                </a>
                            </div>

                            <div className="contact-detail-row">
                                <span className="contact-row-label">
                                    LOCATION
                                </span>

                                <span className="contact-row-value">
                                    <MapPin size={16} />
                                    <span>
                                        Hyderabad, India (Available for Remote / Relocation)
                                    </span>
                                </span>
                            </div>

                            {/* PROFESSIONAL NETWORKS */}

                            <div className="contact-detail-row">
                                <span className="contact-row-label">
                                    PROFESSIONAL NETWORKS
                                </span>

                                <div className="contact-social-cluster">

                                    <a
                                        href="https://github.com/ganesh-591"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-social-chip"
                                        aria-label="Visit my GitHub profile"
                                        data-cursor="GITHUB"
                                    >
                                        <GithubIcon size={18} strokeWidth={1.8} />
                                        <span>GITHUB</span>
                                        <ArrowUpRight size={12} />
                                    </a>

                                    <a
                                        href="https://www.linkedin.com/in/ganesh-kopparthi-716664300/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-social-chip"
                                        aria-label="Visit my LinkedIn profile"
                                        data-cursor="LINKEDIN"
                                    >
                                        <LinkedinIcon size={18} strokeWidth={1.8} />
                                        <span>LINKEDIN</span>
                                        <ArrowUpRight size={12} />
                                    </a>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* MINIMAL LUXURY FOOTER */}

                <footer className="contact-footer-bar">

                    <div className="footer-copy-left">
                        <span>
                            GANESH KOPPARTHI &copy; {new Date().getFullYear()}
                        </span>

                        <span>•</span>

                        <span>JAVA FULL STACK DEVELOPER</span>
                    </div>

                    <button
                        type="button"
                        className="footer-back-to-top"
                        onClick={scrollToTop}
                        aria-label="Back to top of page"
                        data-cursor="TOP"
                    >
                        <span>BACK TO TOP</span>
                        <ArrowUpRight size={14} />
                    </button>

                </footer>

            </div>
        </section>
    );
}
