// pages/About.tsx
import Accordion from 'react-bootstrap/Accordion';
import { useDarkMode } from '../context/DarkModeContext';

export default function About() {
    const { darkMode } = useDarkMode();

    return (
        <div className="container mt-4">
            <h1 className="mb-2">About</h1>
            <hr className="mb-5 mt-0" />
            <p>This journaling app helps you reflect on your by taking a personal inventory as described in the 10th step of Alcoholics Anonymous Hi izzurd.</p>

            <h2 className="h3 mb-4 mt-5">Frequently Asked Questions</h2>
            <style>
                {`
                    .dark-mode-accordion .accordion-button {
                        background-color: #212529;
                        color: #fff;
                    }
                    .dark-mode-accordion .accordion-button:not(.collapsed) {
                        background-color: #2c3034;
                        color: #fff;
                    }
                    .dark-mode-accordion .accordion-button::after {
                        filter: invert(1);
                    }
                    .dark-mode-accordion .accordion-button:focus {
                        border-color: #495057;
                        box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
                    }
                `}
            </style>
            <Accordion className={`mb-5 ${darkMode ? 'dark-mode-accordion' : ''}`}>
                <Accordion.Item
                    eventKey="0"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        Does this site track me or take my data?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        Short answer: No. Some IP address data is collected by the cloud
                        hosting provider, which is standard, but all journal entry data is
                        only ever stored on your browser and never uploaded anywhere.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item
                    eventKey="1"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        Is this site free?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        Yes. This site is free to use and will always be. It does not require any payment or subscription.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item
                    eventKey="2"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        Do I have to create an account to use this site?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        No. You can use this site without creating an account. However, if you create an account, you can
                        track your daily activity streaks and your total days in recovery on the Insights page.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item
                    eventKey="3"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        What data is stored on the cloud if I have an account?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        If you have an account, this data is stored on the cloud to allow you to access your account from any device.
                        It is stored in an industry standard way that is commonly used and secure.
                        <ul>
                            <li>Your custom questions</li>
                            <li>Your custom checkmarks</li>
                            <li>Your journal streaks</li>
                            <li>Your total days in recovery</li>
                            <li>Your recovery date</li>
                            <li>Your username</li>
                            <li>Your email</li>
                            <li>Your encrypted password</li>
                            <li>Your account creation date</li>
                            <li>Your last login date</li>
                        </ul>

                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item
                    eventKey="4"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        How do my custom questions get remembered even if I don't have an account?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        In an effor to provide user anonymity, a feature was added to make an effort
                        at remembering questions from anonymous users. The way this works is that
                        the questions are stored on your device's browser in something called localStorage. Purging
                        your browser history, browser cache etc will likely delete this information. It's stored locally on
                        your browser and is not uploaded anywhere.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item
                    eventKey="5"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        Can I upload my journal entries if I have an account?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        For now, no. This is a feature that is being considered for the future.
                        You can download your journal entries as a PDF, raw text, or word document.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item
                    eventKey="6"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        Why not make an app?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        Making a web app rather than a native app was a conscious decision, if you want to
                        use this site like a native app, you can do so by adding it to your home screen.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}
