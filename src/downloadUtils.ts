import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun } from 'docx'

export function formatFilename(ext: string) {
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        .replace(/\//g, '')
    return `10StepJournal${dateStr}.${ext}`
}

export function downloadAsText(title: string, qa: { q: string, a: string }[]) {
    const lines = [`${title}\n\n`]
    qa.forEach(({ q, a }, i) => {
        lines.push(`${i + 1}. ${q}\n${a}\n`)
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, formatFilename('txt'))
}

export function downloadAsPDF(title: string, qa: { q: string, a: string }[]) {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(title, 10, 20)
    doc.setFontSize(12)

    let y = 30
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

    doc.save(formatFilename('pdf'))
}

export async function downloadAsWord(title: string, qa: { q: string, a: string }[]) {
    const paragraphs = [
        new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 32 })],
        }),
        new Paragraph({ text: '' }),
        ...qa.flatMap(({ q, a }, i) => [
            new Paragraph({ children: [new TextRun({ text: `${i + 1}. ${q}`, bold: true })] }),
            new Paragraph({ text: a || '(No answer)' }),
            new Paragraph({ text: '' }),
        ]),
    ]

    const doc = new Document({ sections: [{ children: paragraphs }] })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, formatFilename('docx'))
}
