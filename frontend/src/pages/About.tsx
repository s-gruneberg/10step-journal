// pages/About.tsx
import Accordion from 'react-bootstrap/Accordion';
import { useDarkMode } from '../context/DarkModeContext'
import "./about.css"
export default function About() {
    const { darkMode } = useDarkMode();

    return (
        <div className="container mt-4">
            <h1 className="mb-2">About</h1>
            <hr className="mb-5 mt-0" />
            <p>This journaling app helps you reflect on your day by taking a personal inventory as described in the 10th step of Alcoholics Anonymous.</p>

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
                        Is this site affiliated with Alcoholics Anonymous?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        No. This site is not affiliated with Alcoholics Anonymous or any other 12-step program.
                        It is a personal project created to help people in recovery.
                        <br />
                        <br />
                        I (the creator) am a member of Alcoholics Anonymous and wanted to create a tool that
                        could help others in recovery.
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
                        Yes. This site is free to use and generates no revenue through ads or other means.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item
                    eventKey="2"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        Is my data safe?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        No data ever leaves your device.
                    </Accordion.Body>
                </Accordion.Item>
                {/* <Accordion.Item
                    eventKey="7"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        Do I have to create an account to use this site?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        No. You can use this site without creating an account.
                        <br />
                        <br />
                        However, if you create an account, you can
                        track your daily activity streaks and your total days in recovery on the Insights page.
                    </Accordion.Body>
                </Accordion.Item> */}
                <Accordion.Item
                    eventKey="3"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        Are my answers kept private?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        Yes.
                        <br />
                        <br />
                        Your answers are temporarily stored in your browser's session storage,
                        which means that they will be lost if you close your broswer tab or
                        clear browsing data.
                        <br />
                        <br />
                        The answers your write to the questions never leave your device.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item
                    eventKey="4"
                    className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                    <Accordion.Header>
                        How do my custom questions get remembered?
                    </Accordion.Header>
                    <Accordion.Body className={darkMode ? 'bg-dark text-light' : ''}>
                        The way this works is that the questions are stored on your device's browser in something called localStorage.
                        <br />
                        Purging your browser history, browser cache etc will likely delete this information. It's stored locally on
                        your browser and is not uploaded anywhere.
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
                        If you want to use this site like a native app, you can do so by adding it to your home screen!
                        <br />
                        <br />
                        On an iPhone, you can do this by going to the share menu in Safari and selecting "Add to Home Screen".
                        <br />
                        <br />
                        On Android, you can do this by going to the menu in Chrome and selecting "Add to Home Screen".
                        <br />
                        <br />
                        This will create an icon on your home screen that will open the site in a standalone window.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}
