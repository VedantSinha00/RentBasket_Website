import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  CalendarCheck,
  MapPin,
  RotateCcw,
  Headset,
  ShoppingBag,
} from "lucide-react";
import logo from "@/assets/7 1.png";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { getRecentOrders } from "@/lib/recentOrders";

const SUPPORT_WHATSAPP = "https://wa.me/919958858473";

const STATUS_CONFIG = {
  active: {
    label: "Active Rental",
    icon: CalendarCheck,
    badgeClass: "bg-success-muted text-success-muted-foreground border-success-border",
    dot: "bg-success",
  },
  upcoming: {
    label: "Arriving Soon",
    icon: Truck,
    badgeClass: "bg-coral-surface text-primary border-coral-border",
    dot: "bg-primary",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badgeClass: "bg-secondary/40 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

const FILTERS = [
  { key: "all", label: "All Orders" },
  { key: "upcoming", label: "Upcoming" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

const OrderCardSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
    <div className="px-5 py-4 border-b border-border/50 bg-secondary/10 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-secondary" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-24 bg-secondary rounded" />
        <div className="h-3 w-16 bg-secondary rounded" />
      </div>
    </div>
    <div className="p-5 space-y-3">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-secondary flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 w-3/4 bg-secondary rounded" />
          <div className="h-3 w-1/2 bg-secondary rounded" />
        </div>
      </div>
    </div>
  </div>
);

const OrderCard = ({ order }) => {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.completed;
  const StatusIcon = cfg.icon;
  const { addToCart } = useCart();

  const handleRentAgain = () => {
    order.items.forEach((item) => {
      addToCart({
        productId: item.amenity_type_id,
        name: item.name,
        duration: "1_month",
        durationLabel: item.durationLabel,
        price: item.rent,
        quantity: item.quantity,
        image: item.image,
      });
    });
    toast.success("Added to cart", { description: "Your previous items are ready to rent again." });
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-4 md:px-6 border-b border-border/50 bg-secondary/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">
              Order #{order.orderId}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
              Booked {order.bookingDate}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${cfg.badgeClass}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {cfg.label}
        </span>
      </div>

      {/* Items */}
      <div className="p-5 md:p-6 space-y-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex gap-4 pb-4 border-b border-border/30 last:border-0 last:pb-0">
            <Link
              to={`/product/${item.amenity_type_id}`}
              className="w-16 h-16 bg-gray-50 rounded-xl border border-border/50 flex-shrink-0 p-1.5 hover:border-primary/30 transition-colors group"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.amenity_type_id}`}>
                <p className="text-sm font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
                  {item.name}
                </p>
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.durationLabel}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>Qty: {item.quantity}</span>
              </div>
              <span className="text-sm font-black text-primary mt-1.5 inline-block">
                ₹{item.rent.toLocaleString("en-IN")}/mo
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Meta strip */}
      <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/50 bg-background p-3.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {order.status === "completed" ? "Was Delivered To" : order.status === "upcoming" ? "Delivering To" : "Delivery"}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{order.address}</p>
            <p className="text-[11px] font-medium text-foreground mt-1.5">
              {order.status === "upcoming" ? "Scheduled: " : ""}{order.deliveryDate} · {order.deliverySlot}
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background p-3.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Billing</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Rent</span>
                <span className="font-bold text-foreground">₹{order.monthlyRent.toLocaleString("en-IN")}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deposit (refundable)</span>
                <span className="font-medium text-foreground">₹{order.deposit.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between pt-1 mt-1 border-t border-border/50">
                <span className="text-muted-foreground font-medium">
                  {order.status === "completed" ? "Returned On" : order.status === "upcoming" ? "Starts On" : "Renews On"}
                </span>
                <span className="font-bold text-foreground">
                  {order.returnedOn || order.startsOn || order.renewsOn}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {order.status === "completed" ? (
            <button
              onClick={handleRentAgain}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Rent Again
            </button>
          ) : order.status === "upcoming" ? (
            <a
              href={SUPPORT_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors active:scale-95"
            >
              <Truck className="w-3.5 h-3.5" />
              Track Delivery
            </a>
          ) : (
            <a
              href="tel:+919958858473"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/30 text-xs font-bold text-primary hover:bg-primary/5 transition-colors active:scale-95"
            >
              <Headset className="w-3.5 h-3.5" />
              Get Support
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // STOPGAP: the order-history API is still pending from Shivam. Until it
    // lands we surface orders placed on this device (see lib/recentOrders.js)
    // so this page reflects a just-placed order instead of a flat empty state.
    // TODO(Shivam API): replace with the real call, e.g.
    //   const auth = getAuth();
    //   const data = await fetch("/orders/my-orders", {
    //     headers: { Authorization: `Bearer ${auth.token}` }
    //   }).then(r => r.json());
    //   setOrders(data.orders);
    setOrders(getRecentOrders());
    setIsLoading(false);
  }, []);

  const visibleOrders = filter === "all"
    ? orders
    : orders.filter((o) => o.status === filter);

  const countFor = (key) => key === "all" ? orders.length : orders.filter((o) => o.status === key).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-4">
        <div className="section-container">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src={logo} alt="RentBasket logo" className="w-24 md:w-28" />
              </div>
            </Link>
            <Link to="/catalog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Browse More
            </Link>
          </div>
        </div>
      </header>

      <main className="section-container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black font-display text-foreground tracking-tight">
                My Orders
              </h1>
              <p className="text-[11px] md:text-sm text-muted-foreground font-medium">
                Track, manage, and renew your rentals
              </p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-6 mb-6 -mx-1 px-1">
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    isActive ? "bg-primary text-white shadow-soft" : "bg-secondary/40 text-muted-foreground hover:bg-secondary/70"
                  }`}
                >
                  {f.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-background"}`}>
                    {countFor(f.key)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-5">
              {[1, 2].map((n) => <OrderCardSkeleton key={n} />)}
            </div>
          ) : visibleOrders.length > 0 ? (
            <div className="space-y-5">
              {visibleOrders.map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-card border border-dashed border-border rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-secondary/40 flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No orders here yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                {filter !== "all"
                  ? `You don't have any ${filter} orders.`
                  : "You haven't placed any orders yet."} Browse our catalogue and set up your home in minutes.
              </p>
              <Link to="/catalog" className="btn-gradient-coral inline-flex px-6 py-3 text-sm font-semibold">
                Browse Catalogue
              </Link>
            </div>
          )}

          <div className="mt-10 text-center text-xs md:text-sm text-muted-foreground py-6 border-t border-border/50">
            Need help with an order?{" "}
            <a href="tel:+919958858473" className="text-primary font-bold hover:underline">
              Call +91 9958858473
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyOrders;
