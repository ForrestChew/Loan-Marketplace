import "./Home.css";

const Home = () => {
  return (
    <>
      <section className="title">
        <h1>
          Loan Marketplace <em>(not predetory)</em>
        </h1>
        <h4>Borrow, Lend, and sell debt through this defi protocal.</h4>
        <h4>
          Your financial <b>future</b> awaits.
        </h4>
      </section>
      <section className="stats">
        <h1>Active</h1>
        <ul className="stat-items">
          <div className="stat-contents">
            <li>Lenders</li>
            <li>{0}</li>
          </div>
          <div className="stat-contents">
            <li>Borrowers</li>
            <li>{0}</li>
          </div>
          <div className="stat-contents">
            <li>Proposals</li>
            <li>{0}</li>
          </div>
          <div className="stat-contents">
            <li>Loans</li>
            <li>{0}</li>
          </div>
          <div className="stat-contents">
            <li>Fractional Loans</li>
            <li>{0}</li>
          </div>
        </ul>
      </section>
    </>
  );
};

export default Home;
