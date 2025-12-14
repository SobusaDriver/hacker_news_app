const fs = require("fs")
const path = require("path")

const coveragePath = path.join(__dirname, "../coverage/coverage-final.json")
const outputPath = path.join(__dirname, "../coverage_report.md")

try {
  const coverageData = JSON.parse(fs.readFileSync(coveragePath, "utf8"))
  let report = "# Code Coverage Report (Files with Missing Coverage)\n\n"
  report += "| File | Statements | Branches | Functions | Lines | Uncovered Lines |\n"
  report += "|---|---|---|---|---|---|\n"

  const files = Object.keys(coverageData).sort()
  let hasMissingCoverage = false

  files.forEach((file) => {
    // Filter for .ts and .tsx files only as requested, though usually coverage only includes source files anyway
    if (!file.match(/\.tsx?$/)) return
    // Exclude .styles.ts files
    if (file.match(/\.styles\.ts$/)) return

    // Normalize path to be relative to project root (approximate)
    const relativePath = file.replace(process.cwd() + "/", "")

    const fileCoverage = coverageData[file]
    const { s, f, b, statementMap, fnMap, branchMap } = fileCoverage

    // Helper to calculate percentage and missing
    const calculateMetric = (counts, map) => {
      const keys = Object.keys(counts)
      const total = keys.length
      const covered = keys.filter((k) => counts[k] > 0).length
      return {
        total,
        covered,
        pct: total === 0 ? 100 : ((covered / total) * 100).toFixed(2),
        missing: keys.filter((k) => counts[k] === 0),
      }
    }

    // For lines, standard istanbul uses statement coverage as line coverage proxy usually,
    // or we can assume statement map keys are line indicators.
    // Actually, 's' is statements.
    const stmtMetric = calculateMetric(s, statementMap)
    const fnMetric = calculateMetric(f, fnMap)

    // Branches are a bit different: each key in 'b' is an array of counts (one for each path in the branch).
    let branchTotal = 0
    let branchCovered = 0
    Object.keys(b).forEach((key) => {
      const branchCounts = b[key]
      branchTotal += branchCounts.length
      branchCovered += branchCounts.filter((c) => c > 0).length
    })
    const branchPct = branchTotal === 0 ? 100 : ((branchCovered / branchTotal) * 100).toFixed(2)

    // Identify uncovered lines (simplification using statements)
    const uncoveredLines = []
    Object.keys(s).forEach((key) => {
      if (s[key] === 0) {
        const decl = statementMap[key]
        if (decl) {
          uncoveredLines.push(`${decl.start.line}`) //-${decl.end.line}
        }
      }
    })

    // Also check functions
    const uncoveredFunctions = []
    Object.keys(f).forEach((key) => {
      if (f[key] === 0) {
        const decl = fnMap[key]
        if (decl) {
          uncoveredFunctions.push(decl.name)
        }
      }
    })

    // Check if fully covered
    const isFullCoverage = stmtMetric.pct == 100 && fnMetric.pct == 100 && branchPct == 100

    if (!isFullCoverage) {
      hasMissingCoverage = true
      // consolidate lines ranges
      const uniqueLines = [...new Set(uncoveredLines)].sort((a, b) => a - b)
      const ranges = uniqueLines
        .reduce((acc, line) => {
          line = parseInt(line)
          if (acc.length === 0) return [[line, line]]
          const last = acc[acc.length - 1]
          if (line === last[1] + 1) {
            last[1] = line
          } else {
            acc.push([line, line])
          }
          return acc
        }, [])
        .map((r) => (r[0] === r[1] ? r[0] : `${r[0]}-${r[1]}`))
        .join(", ")

      report += `| ${relativePath} | ${stmtMetric.pct}% | ${branchPct}% | ${fnMetric.pct}% | ${stmtMetric.pct}% | ${ranges || "-"} |\n`

      if (uncoveredFunctions.length > 0) {
        report += `| | | | *Missing Funcs:* | ${uncoveredFunctions.join(", ")} | |\n`
      }
    }
  })

  if (!hasMissingCoverage) {
    report += "\n\n**All .ts/.tsx files have 100% coverage!**\n"
  }

  fs.writeFileSync(outputPath, report)
  console.log(`Coverage report generated at ${outputPath}`)
} catch (error) {
  console.error("Error parsing coverage:", error)
  process.exit(1)
}
