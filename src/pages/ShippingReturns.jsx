import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ShippingReturns = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-12 md:py-20 max-w-4xl">
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink mb-4">
          Shipping &amp; Returns Policy
        </h1>
        <p className="text-sm text-ink-muted mb-8">
          Last updated: June 2, 2026
        </p>

        <div className="space-y-8 max-w-[70ch] text-ink/90 font-sans leading-relaxed text-[15px] sm:text-base">
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink">
              1. Delivery &amp; Professional Installation
            </h2>
            <p>
              We provide free delivery and professional installation services for all monthly lease orders within our service areas in Gurgaon and Noida (Delhi NCR).
            </p>
            <p>
              Once your KYC verification is successful, our customer support team will contact you to schedule a delivery time. Standard delivery takes 3–5 business days. Please make sure a representative is present at the delivery location to accept the order and complete the final 50% split payment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink">
              2. Returns &amp; Asset Inspection
            </h2>
            <p>
              At the end of your rental tenure, RentBasket will schedule a free pickup of the leased products. 
            </p>
            <p>
              Our quality assurance team will inspect the items at the time of pickup. The inspection focuses on ensuring the products are functional and free from major physical or structural damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink">
              3. Damage Policy (Wear &amp; Tear vs. Damage)
            </h2>
            <p>
              We understand that furniture and appliances will experience use. 
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
              <li>
                <strong className="text-success-muted-foreground">Normal Wear &amp; Tear (No Charge):</strong> Subtle fabric scuffs, tiny scratches, minor color fading from sunlight, and regular mechanical wear are fully covered.
              </li>
              <li>
                <strong className="text-destructive">Major/Structural Damage (Charged):</strong> Deep burns, torn upholstery, water damage due to negligence, broken panels, cracked appliance screens, or missing parts are not covered. Repair or replacement costs will be deducted from the refundable security deposit.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink">
              4. Security Deposit Refund Timeline
            </h2>
            <p>
              Following a successful inspection post-pickup, your security deposit will be processed and returned to your bank account within 7–10 working days. 
            </p>
            <p>
              If deductions are necessary due to damages, RentBasket will share an itemized breakdown of the charges and refund the remaining balance within the same timeline.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink">
              5. Lease Extensions &amp; Late Returns
            </h2>
            <p>
              If you wish to extend your lease, please notify support at least 14 days before your tenure ends. 
            </p>
            <p>
              Failure to return the items on the scheduled date without coordinating an extension will result in late return fees charged on a pro-rata basis at our standard non-discounted monthly rental rate.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingReturns;
