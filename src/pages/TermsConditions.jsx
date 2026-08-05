import Footer from "@/components/Footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="section-container py-12 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-foreground mb-3">
            Terms &amp; Conditions
          </h1>
          <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full mb-6"></div>
          <p className="text-sm text-muted-foreground">
            Last updated: August 5, 2026
          </p>
        </div>

        <div className="space-y-10 text-foreground/85 font-sans leading-relaxed text-[15px] sm:text-base">
          <section className="space-y-4 pb-8 border-b border-border/50">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground pt-2">
              1. Terms and Termination
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold">1.1</span> This Agreement shall remain binding on the parties for the entire lease period.</p>
              <p><span className="font-semibold">1.2</span> The Client shall be bound by a lock-in period as detailed in Annexure I under this Agreement.</p>
              <p><span className="font-semibold">1.3</span> This Agreement shall not be terminable during the lock-in period prescribed hereinabove. Notwithstanding anything contained herein, in the event of a termination within the lock-in period, the terms of Annexure I shall apply.</p>
              <p><span className="font-semibold">1.4</span> The term of this Agreement may be extended by mutual agreement between the Parties for a minimum period of One (1) month.</p>
              <p><span className="font-semibold">1.5</span> In the event of termination of the Agreement mid-billing cycle, the rent for that month shall be calculated on a pro-rata basis.</p>
              <p><span className="font-semibold">1.6</span> The Contractor shall be entitled to terminate this Agreement if the Client fails to pay the requisite rent amount by the last day of the month.</p>
              <p><span className="font-semibold">1.7</span> In the event of a termination under Clause 1.6, the Contractor shall be entitled to reclaim all leased goods from the Client's premises. The decision to refund the security deposit, if any, shall be at the sole discretion of the Contractor.</p>
              <p><span className="font-semibold">1.8</span> The Client may terminate this Agreement at any time by providing a written notice of one (1) month to the Contractor.</p>
            </div>
          </section>

          <section className="space-y-4 pb-8 border-b border-border/50">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground pt-2">
              2. Payment Modalities
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold">2.1</span> The Client shall be liable to deposit an amount as detailed in the Annexure below as a security deposit at the time of placing the order upon the Contractor. This deposit shall be a refundable deposit, which shall be refunded to the Client at the time of termination of this Agreement, after making due adjustments on account of damage, etc.</p>
              <p><span className="font-semibold">2.2</span> The shipping and handling charges for the delivery of goods ordered by the Client shall be borne by the Contractor as detailed in Annexure I. Additional charges, if any, arising out of the delivery of goods (e.g., labor charges), which shall be communicated by the Contractor to the Client, shall also be borne by the Client.</p>
              <p><span className="font-semibold">2.3</span> The billing for the first month shall be calculated on a pro-rata basis from the date of delivery. Subsequently, each payment cycle shall operate on a month-to-month basis.</p>
              <p><span className="font-semibold">2.4</span> The rent for each month shall be paid by the Client not later than the 7th day of each month. (Not applicable in case total rent is paid in advance)</p>
              <p><span className="font-semibold">2.5</span> Late fees are levied on the rental due amount only. Three late fee tiers are applied each month: up to the 15th, ₹100 will be charged; 5% after the 15th; and 10% after the 25th. Each fee applies only to any pending rental dues, not to already-applied late fees. In special cases, delay charges may be waived at the sole discretion of the Contractor.</p>
            </div>
          </section>

          <section className="space-y-4 pb-8 border-b border-border/50">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground pt-2">
              3. Security Deposit
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold">3.1</span> The Security Deposit shall be refunded after the Company has taken possession of all the products delivered as part of the Solution.</p>
              <p><span className="font-semibold">3.2</span> Within seven (7) working days from the date of issue of Pick Up, the Company shall process the refund of the Security Deposit, subject to deductions for damages, unpaid Subscription Fees, and any other applicable charges.</p>
              <p><span className="font-semibold">3.3</span> The Security Deposit does not include any monthly subscription fee. It is solely intended to cover potential damages (if any).</p>
            </div>
          </section>

          <section className="space-y-4 pb-8 border-b border-border/50">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground pt-2">
              4. Delivery Process
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold">4.1</span> The Client shall ensure entry of the delivery vehicle into the premises and arrange for permission to use the elevator. If an elevator is unavailable at the delivery location, the Client must inform the Contractor prior to the scheduled delivery date. The Contractor shall charge labor fees for carrying items via stairs, which shall be discussed at the time of delivery or while scheduling.</p>
              <p><span className="font-semibold">4.2</span> Photos of the Client with the delivered items will be taken for the Contractor's records. The Client is expected to allow the Contractor's representatives to take these photographs.</p>
              <p><span className="font-semibold">4.3</span> Although detailed quality checks are conducted before delivery, the Client must inspect the items upon delivery and report any damage to the Contractor's representative. Photographic evidence of such damage will be captured at that time.</p>
            </div>
          </section>

          <section className="space-y-4 pb-8 border-b border-border/50">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground pt-2">
              5. Pick-Up Process
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold">5.1</span> The date of pick-up of goods upon termination of this Agreement shall be mutually agreed upon by both Parties.</p>
              <p><span className="font-semibold">5.2</span> The Client or their representative must be present at the agreed pick-up date and time. Failure to be present will result in additional logistic charges borne by the Client.</p>
              <p><span className="font-semibold">5.3</span> The Quality Control Report and photographs taken during pick-up shall form part of this Agreement.</p>
              <p><span className="font-semibold">5.4</span> The photographs taken at the time of delivery will be used for comparison to determine the extent of any damages.</p>
            </div>
          </section>

          <section className="space-y-4 pb-8 border-b border-border/50">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground pt-2">
              6. Damage Policy
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold">6.1</span> The Client shall be liable to pay for any damage, loss, or theft of goods. Irreparable goods must be paid for at their Market Price as determined by the Contractor.</p>
              <p><span className="font-semibold">6.2</span> During complaints or at the time of pick-up, the Contractor or its representative shall inspect all goods to assess damage by comparing delivery photographs and the signed quality control documents.</p>
              <p><span className="font-semibold">6.3</span> The Contractor's assessment of damage shall be final.</p>
              <p><span className="font-semibold">6.4</span> A damage report (QC report) will be generated on the spot, and a copy shall be provided to the Client.</p>
              <p><span className="font-semibold">6.5</span> Damage shall include, but is not limited to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Scratches and dents causing structural or major visual defects in wooden furniture.</li>
                <li>Damage due to manufacturing defects will not be charged to the Client.</li>
                <li>Tears in upholstery will incur a charge for replacement.</li>
                <li>Stains on upholstery that cannot be removed by dry cleaning will also result in a charge for replacement.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4 pb-8 border-b border-border/50">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground pt-2">
              7. Refund Policy
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold">7.1</span> At the time of pick-up upon termination, a damage report will be created per Clause 5. A list of damages will be provided to the Client by the Contractor's representative.</p>
              <p><span className="font-semibold">7.2</span> Upon receipt, the goods will undergo a quality check to determine any repair costs. These will be deducted from the refundable security deposit, and the remaining balance will be transferred to the Client's bank account within seven (7) working days.</p>
              <p><span className="font-semibold">7.3</span> In case of early termination, the Client must notify the Contractor at least one month in advance. The Client must then pay the difference between the original contract rental rate and the rate applicable based on actual tenure. The amount due is calculated as:</p>
              <p className="ml-4">(Actual tenure rent - Contract tenure rent) × Number of months of actual tenure.</p>
              <p className="ml-4"><span className="font-semibold">Applicable tenure rates for early closure:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Up to 3 months: Full 3 months' rental due</li>
                <li>3–6 months: 3 months' rental rate</li>
                <li>6–9 months: 6 months' rental rate</li>
                <li>9–12 months: 9 months' rental rate</li>
                <li>12–18 months: 12 months' rental rate</li>
                <li>18–24 months: 18 months' rental rate</li>
              </ul>
              <p><span className="font-semibold">7.4</span> In case of early termination, pick-up and labor charges shall be borne by the Client.</p>
            </div>
          </section>

          <section className="space-y-4 pb-8 border-b border-border/50">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground pt-2">
              8. Maintenance Policy
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold">8.1</span> Maintenance of electronic appliances shall be taken care of by the Contractor for the entire tenure of this Agreement. However, any cost incurred on account of damage or breakdown due to mishandling shall be borne by the Client.</p>
              <p><span className="font-semibold">8.2</span> The Contractor shall address any such complaints received from the Client within seven (7) working days of reporting.</p>
              <p><span className="font-semibold">8.3</span> The Contractor shall provide basic maintenance of the Products delivered to the Customer throughout the duration of this Agreement, or upon request. Cleaning of furniture (one time per year) shall only be provided after the Customer completes a minimum of 12 months' tenure.</p>
              <p><span className="font-semibold">8.4</span> Periodic maintenance does not include damage or breakdown due to Client mishandling. The Contractor shall perform maintenance or repairs within 3–5 working days of a request. If the issue cannot be resolved during repair, a replacement Product will be provided. Any additional cost incurred due to damage during maintenance or cleaning shall be borne by the Client and paid online or as advised by the Contractor's service representative.</p>
            </div>
          </section>

          <section className="space-y-4 pb-8 border-b border-border/50">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground pt-2">
              9. Unauthorized Movement of Rented Furniture and Appliances
            </h2>
            <div className="space-y-2">
              <p>Movement of any or all products from the delivery address listed in Annexure-I, without the written consent of the Contractor, shall be considered unauthorized and/or illegal. In such cases, the Contractor reserves the right to take one or more of the following actions:</p>
              <p><span className="font-semibold">9.1</span> Immediate Termination of Rental Agreement: The agreement may be terminated without notice.</p>
              <p><span className="font-semibold">9.2</span> Legal Consequences: The incident may be reported to law enforcement authorities, potentially resulting in criminal charges.</p>
              <p><span className="font-semibold">9.3</span> Financial Penalties: The Client may be held liable for damages, losses, or penalties resulting from unauthorized movement.</p>
              <p><span className="font-semibold">9.4</span> Jurisdiction: Any legal disputes shall fall under the jurisdiction of local courts only. Gurugram courts for Haryana and Noida Courts for UP.</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;
