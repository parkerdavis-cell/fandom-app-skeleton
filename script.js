/*
 * Simple client‑side router and page renderer for the FANdom demo.
 * Pages are defined as functions returning HTML strings.  When a
 * navigation link is clicked, the appropriate page is rendered
 * into the <main> element.  This avoids any build tooling or
 * framework dependencies and keeps everything in pure JavaScript.
 */

// Define page templates
const pages = {
  Dashboard: () => {
    return `
      <h2>Dashboard</h2>
      <div class="card">
        <h3>Total Income</h3>
        <p style="font-size:1.5rem;font-weight:bold;">$8,200</p>
        <small>$0 this week</small>
      </div>
      <div class="card">
        <h3>Total Expenses</h3>
        <p style="font-size:1.5rem;font-weight:bold;">$5,000</p>
        <small>2 transactions</small>
      </div>
      <div class="card">
        <h3>Low Stock Items</h3>
        <p style="font-size:1.5rem;font-weight:bold;">4</p>
        <small>Need reorder</small>
      </div>
      <div class="card">
        <h3>Pending Requests</h3>
        <p style="font-size:1.5rem;font-weight:bold;">1</p>
        <small>Awaiting approval</small>
      </div>
      <div class="card">
        <h3>Recent Transactions</h3>
        <ul style="list-style:none;padding:0;margin:0;">
          <li style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
            <span>Concessions sales – Homecoming game</span>
            <span style="color:#38a169;font-weight:bold;">+$2,450</span>
          </li>
          <li style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
            <span>Gold Level Sponsorship – Johnson Auto</span>
            <span style="color:#38a169;font-weight:bold;">+$5,000</span>
          </li>
          <li style="display:flex;justify-content:space-between;">
            <span>New practice equipment – Football</span>
            <span style="color:#e53e3e;font-weight:bold;">−$3,200</span>
          </li>
        </ul>
      </div>
    `;
  },
  Budget: () => {
    const rows = [
      { team: 'Varsity Football', category: 'Equipment', budget: 5000, spent: 3200 },
      { team: 'JV Basketball', category: 'Travel', budget: 3000, spent: 1100 },
      { team: 'Varsity Cheer', category: 'Uniforms', budget: 2000, spent: 1800 },
    ];
    const body = rows
      .map(r => {
        const remaining = r.budget - r.spent;
        return `<tr><td>${r.team}</td><td>${r.category}</td><td>$${r.budget.toLocaleString()}</td><td>$${r.spent.toLocaleString()}</td><td>$${remaining.toLocaleString()}</td></tr>`;
      })
      .join('');
    return `
      <h2>Budget & Finance</h2>
      <div class="card">
        <table>
          <thead>
            <tr><th>Team</th><th>Category</th><th>Budget</th><th>Spent</th><th>Remaining</th></tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
  },
  Concessions: () => {
    const items = [
      { name: 'Hot Dogs', qty: 40, par: 50 },
      { name: 'Chips', qty: 25, par: 30 },
      { name: 'Soda Cans', qty: 100, par: 120 },
      { name: 'Nacho Cheese', qty: 10, par: 15 },
    ];
    const body = items
      .map(item => {
        const low = item.qty < item.par;
        const status = low ? '<span style="color:#dd6b20;">Reorder</span>' : '<span style="color:#38a169;">OK</span>';
        return `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.par}</td><td>${status}</td></tr>`;
      })
      .join('');
    return `
      <h2>Concessions Inventory</h2>
      <div class="card">
        <table>
          <thead>
            <tr><th>Item</th><th>On Hand</th><th>Par Level</th><th>Status</th></tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
  },
  Sponsorships: () => {
    const tiers = [
      { tier: 'Bronze', price: 500, benefits: ['Logo on website', 'PA shout‑out at one game'] },
      { tier: 'Silver', price: 1000, benefits: ['All Bronze benefits', 'Banner at field', 'Social media shout‑out'] },
      { tier: 'Gold', price: 2500, benefits: ['All Silver benefits', 'Table at banquet', 'Program ad'] },
    ];
    return `
      <h2>Sponsorship Packages</h2>
      ${tiers
        .map(t => {
          return `
            <div class="card" style="border-left:4px solid #4c80bf;">
              <h3>${t.tier}</h3>
              <p style="font-size:1.5rem;font-weight:bold;color:#3182ce;">$${t.price.toLocaleString()}</p>
              <ul style="padding-left:1rem;">${t.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
              <button style="margin-top:0.5rem;padding:0.5rem 1rem;border:none;border-radius:4px;background-color:#3182ce;color:#fff;cursor:pointer;">Choose ${t.tier}</button>
            </div>`;
        })
        .join('')}
    `;
  },
  Teams: () => {
    const teams = [
      { name: 'Varsity Football', events: [{ name: 'Homecoming vs. Tigers', date: '2024-10-14' }, { name: 'Playoffs Round 1', date: '2024-11-05' }] },
      { name: 'JV Basketball', events: [{ name: 'Tournament – Pool Play', date: '2024-12-10' }] },
      { name: 'Varsity Cheer', events: [{ name: 'Regional Competition', date: '2024-09-22' }] },
    ];
    return `
      <h2>Teams & Events</h2>
      ${teams
        .map(team => {
          return `
            <div class="card">
              <h3>${team.name}</h3>
              <ul style="padding-left:1rem;">
                ${team.events
                  .map(e => `<li><strong>${e.name}</strong> – ${e.date}</li>`)
                  .join('')}
              </ul>
            </div>`;
        })
        .join('')}
    `;
  },
  Volunteers: () => {
    const shifts = [
      { role: 'Concession Stand – Game vs. Tigers', date: '2024-10-14', needed: 4, signedUp: 3 },
      { role: 'Gate Ticketing – Tournament', date: '2024-12-10', needed: 2, signedUp: 1 },
      { role: 'Merch Table – Regional Competition', date: '2024-09-22', needed: 2, signedUp: 2 },
    ];
    const body = shifts
      .map(shift => {
        const coverage = Math.min(Math.round((shift.signedUp / shift.needed) * 100), 100);
        return `
          <tr>
            <td>${shift.role}</td>
            <td>${shift.date}</td>
            <td>${shift.needed}</td>
            <td>${shift.signedUp}</td>
            <td>
              <div class="progress-bar">
                <div style="width:${coverage}%;"></div>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');
    return `
      <h2>Volunteer Shifts</h2>
      <div class="card">
        <table>
          <thead><tr><th>Role</th><th>Date</th><th>Needed</th><th>Signed Up</th><th>Coverage</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
  },
  Purchases: () => {
    const requests = [
      { team: 'Varsity Football', item: 'Uniforms', amount: 1200, status: 'Pending' },
      { team: 'JV Basketball', item: 'Practice Balls', amount: 300, status: 'Approved' },
      { team: 'Varsity Cheer', item: 'Warm‑ups', amount: 450, status: 'Rejected' },
    ];
    const body = requests
      .map(req => {
        let color;
        if (req.status === 'Approved') color = '#38a169';
        else if (req.status === 'Rejected') color = '#e53e3e';
        else color = '#3182ce';
        return `<tr><td>${req.team}</td><td>${req.item}</td><td>$${req.amount.toLocaleString()}</td><td style=\"color:${color};font-weight:bold;\">${req.status}</td></tr>`;
      })
      .join('');
    return `
      <h2>Purchase Requests</h2>
      <div class=\"card\">
        <table>
          <thead><tr><th>Team</th><th>Item</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
  },
};

// Render a page and update navigation
function renderPage(name) {
  const main = document.querySelector('main');
  if (pages[name]) {
    main.innerHTML = pages[name]();
  }
  // Update active link
  document.querySelectorAll('.nav-bar a').forEach(a => {
    if (a.dataset.page === name) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

// Attach listeners to nav links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-bar a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const page = a.dataset.page;
      renderPage(page);
    });
  });
  // Initial page
  renderPage('Dashboard');
});
