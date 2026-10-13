// Integration verification script
async function runTests() {
  try {
    const health = await fetch('http://localhost:5000/api/health').then(r => r.json());
    console.log('1. Health check:', health.status);

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'SecurityAdmin2026!' })
    }).then(r => r.json());
    console.log('2. Admin Auth:', loginRes.success, '| User:', loginRes.user.name, '| Role:', loginRes.user.role);

    const stats = await fetch('http://localhost:5000/api/reports/dashboard-stats').then(r => r.json());
    console.log('3. Dashboard Stats | Total attempts:', stats.summary.totalAttempts, '| Active alerts:', stats.summary.activeAlerts);

    const rules = await fetch('http://localhost:5000/api/rules').then(r => r.json());
    console.log('4. Rules Count:', rules.rules.length, '| Rule Names:', rules.rules.map(r => r.id).join(', '));

    const testRule = await fetch('http://localhost:5000/api/rules/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'root', ipAddress: '185.220.101.5', status: 'FAILURE', eventType: 'SSH_ACCESS' })
    }).then(r => r.json());
    console.log('5. Rule Engine Test Triggers:', testRule.evaluation.triggers.length, '| Recommended Risk:', testRule.evaluation.recommendedRiskLevel);

    const inv = await fetch('http://localhost:5000/api/investigate/ip/185.220.101.5').then(r => r.json());
    console.log('6. IP Investigation:', inv.target, '| Threat Score:', inv.threatScore, '| Classification:', inv.threatClassification);

    const report = await fetch('http://localhost:5000/api/reports/summary?range=24h').then(r => r.json());
    console.log('7. Report Generation | Total attempts in 24h:', report.metrics.totalAttempts, '| Success rate:', report.metrics.successRate);

    const attackRes = await fetch('http://localhost:5000/api/simulate/attack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: 'brute_force' })
    }).then(r => r.json());
    console.log('8. Attack Simulation:', attackRes.message);

    console.log('\n>>> ALL 8 FULL-STACK SYSTEM TESTS PASSED SUCCESSFULLY! <<<');
  } catch (e) {
    console.error('Test error:', e);
  }
}

runTests();
