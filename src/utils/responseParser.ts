export interface ParsedProject {
  projectName: string;
  problemItSolves: string;
  whyRecruitersLoveIt: string;
  techStack: string;
  difficulty: string;
  timeToBuild: string;
  steps: Array<{ title: string; description: string }>;
  proTip: string;
}

export function parseProjectResponse(response: string): ParsedProject {
  const lines = response.split('\n').filter(line => line.trim());

  const extractField = (prefix: string): string => {
    const line = lines.find(l => l.startsWith(prefix));
    return line ? line.replace(prefix, '').trim() : '';
  };

  const extractSteps = (): Array<{ title: string; description: string }> => {
    const steps = [];
    for (let i = 1; i <= 5; i++) {
      const stepLine = lines.find(l => l.startsWith(`STEP ${i}:`));
      if (stepLine) {
        const content = stepLine.replace(`STEP ${i}:`, '').trim();
        const [title, ...descParts] = content.split(' - ');
        steps.push({
          title: title.trim(),
          description: descParts.join(' - ').trim(),
        });
      }
    }
    return steps;
  };

  return {
    projectName: extractField('PROJECT NAME:'),
    problemItSolves: extractField('PROBLEM IT SOLVES:'),
    whyRecruitersLoveIt: extractField('WHY RECRUITERS LOVE IT:'),
    techStack: extractField('TECH STACK:'),
    difficulty: extractField('DIFFICULTY:'),
    timeToBuild: extractField('TIME TO BUILD:'),
    steps: extractSteps(),
    proTip: extractField('PRO TIP:'),
  };
}
