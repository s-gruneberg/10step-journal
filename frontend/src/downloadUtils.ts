import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun } from 'docx'

export function formatFilename(ext: string) {
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        .replace(/\//g, '')
    return `10StepJournal${dateStr}.${ext}`
}

interface JournalContent {
    title: string;
    qa: { q: string; a: string }[];
    checkmarks: Record<string, boolean>;
}

const hasCheckmarks = (checkmarks: Record<string, boolean>) => Object.keys(checkmarks).length > 0

/** Build the same plain-text format used for download/copy */
export function getTextContent({ title, qa, checkmarks }: JournalContent): string {
    const lines = [`${title}\n\n`]

    // Inventory Questions first
    lines.push('Inventory Questions:\n')
    qa.forEach(({ q, a }, i) => {
        lines.push(`${i + 1}. ${q}\n${a}\n`)
    })

    // Daily Activities at the end, only if any are present/checked
    if (hasCheckmarks(checkmarks)) {
        lines.push('\nDaily Activities:\n')
        Object.entries(checkmarks).forEach(([activity, checked]) => {
            lines.push(`${activity}: ${checked ? 'Yes' : 'No'}\n`)
        })
    }

    return lines.join('\n')
}

export function downloadAsText({ title, qa, checkmarks }: JournalContent) {
    const text = getTextContent({ title, qa, checkmarks })
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, formatFilename('txt'))
}

export function downloadAsPDF({ title, qa, checkmarks }: JournalContent) {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(title, 10, 20)
    doc.setFontSize(12)

    let y = 30

    // Inventory Questions first
    doc.setFontSize(14)
    doc.text('Inventory Questions:', 10, y)
    y += 10
    doc.setFontSize(12)

    qa.forEach(({ q, a }, i) => {
        const question = `${i + 1}. ${q}`
        const answer = a || '(No answer)'
        doc.text(question, 10, y)
        y += 7
        const splitAnswer = doc.splitTextToSize(answer, 180)
        doc.text(splitAnswer, 10, y)
        y += splitAnswer.length * 7 + 5
        if (y > 280) {
            doc.addPage()
            y = 20
        }
    })

    // Daily Activities at the end, only if any are present/checked
    if (hasCheckmarks(checkmarks)) {
        y += 10
        doc.setFontSize(14)
        doc.text('Daily Activities:', 10, y)
        y += 10
        doc.setFontSize(12)
        Object.entries(checkmarks).forEach(([activity, checked]) => {
            doc.text(`${activity}: ${checked ? 'Yes' : 'No'}`, 10, y)
            y += 7
        })
    }

    doc.save(formatFilename('pdf'))
}

export async function downloadAsWord({ title, qa, checkmarks }: JournalContent) {
    const paragraphs = [
        new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 32 })],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
            children: [new TextRun({ text: 'Inventory Questions:', bold: true, size: 24 })],
        }),
        ...qa.flatMap(({ q, a }, i) => [
            new Paragraph({ children: [new TextRun({ text: `${i + 1}. ${q}`, bold: true })] }),
            new Paragraph({ text: a || '(No answer)' }),
            new Paragraph({ text: '' }),
        ]),
    ]

    // Daily Activities at the end, only if any are present/checked
    if (hasCheckmarks(checkmarks)) {
        paragraphs.push(new Paragraph({ text: '' }))
        paragraphs.push(new Paragraph({
            children: [new TextRun({ text: 'Daily Activities:', bold: true, size: 24 })],
        }))
        paragraphs.push(
            ...Object.entries(checkmarks).map(([activity, checked]) =>
                new Paragraph({
                    children: [
                        new TextRun({ text: `${activity}: `, bold: true }),
                        new TextRun({ text: checked ? 'Yes' : 'No' })
                    ],
                })
            )
        )
    }

    const doc = new Document({ sections: [{ children: paragraphs }] })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, formatFilename('docx'))
}
