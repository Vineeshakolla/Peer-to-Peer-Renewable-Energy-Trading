module et::EscrowPlatform {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use std::vector;
    use std::option;

    /// Pending trade stored under platform account until confirmed/refunded
    struct PendingTrade has copy, drop, store {
        listing_id: u64,
        buyer: address,
        producer: address,
        amount: u64, // amount in AptosCoin's smallest unit
    }

    /// Escrow container stored under platform/operator account
    struct Escrow has key {
        trades: vector<PendingTrade>
    }

    /// Initialize platform escrow storage (call once by platform account)
    public fun init_platform(platform: &signer) {
        let addr = signer::address_of(platform);
        if (!exists<Escrow>(addr)) {
            move_to(platform, Escrow { trades: vector::empty<PendingTrade>() });
        }
    }

    /// Buyer deposits funds into platform escrow for a listing
    /// buyer signs and transfers `amount` AptosCoin to platform account
    public fun deposit_escrow(buyer: &signer, producer: address, listing_id: u64, amount: u64) {
        let platform_addr = signer::address_of(buyer); // placeholder — buyer sends coins then platform must be funded separately
        // Withdraw payment from buyer
        let payment = coin::withdraw<AptosCoin>(buyer, amount);
        // Deposit to platform account (the operator must be the caller later to confirm)
        // Note: deposit requires an address. For safety, we deposit into the caller's address (buyer) then the platform operator should collect.
        // Instead, we'll require the platform address to be the module publisher address; use deposit to platform address.
        let platform_address = @0x1f35f31c2e91a3c88252a4882cefb0732f7de5c7d84571d123d3867a08f3bb29;
        coin::deposit<AptosCoin>(platform_address, payment);

        // Record pending trade under platform
        assert!(exists<Escrow>(platform_address), 1);
        let escrow_ref = borrow_global_mut<Escrow>(platform_address);
        let pt = PendingTrade { listing_id, buyer: signer::address_of(buyer), producer, amount };
        vector::push_back(&mut escrow_ref.trades, pt);
    }

    /// Platform confirms delivery and releases escrow to producer
    /// Only platform/operator (the account that stores Escrow) should call this
    public fun confirm_delivery(platform: &signer, buyer: address, producer: address, listing_id: u64) acquires Escrow {
        let paddr = signer::address_of(platform);
        assert!(exists<Escrow>(paddr), 2);
        let escrow_ref = borrow_global_mut<Escrow>(paddr);

        // find matching pending trade (linear search)
        let len = vector::length(&escrow_ref.trades);
        let mut i = 0;
        let mut found = false;
        let mut amt = 0;
        while (i < len) {
            let t = *vector::borrow(&escrow_ref.trades, i);
            if (t.listing_id == listing_id && t.buyer == buyer && t.producer == producer) {
                amt = t.amount;
                found = true;
                break;
            }
            i = i + 1;
        }
        assert!(found, 3);

        // remove pending trade (swap_remove)
        vector::swap_remove(&mut escrow_ref.trades, i);

        // transfer funds from platform -> producer
        let payment = coin::withdraw<AptosCoin>(platform, amt);
        coin::deposit<AptosCoin>(producer, payment);
    }

    /// Platform can refund buyer (in case of dispute)
    public fun refund(platform: &signer, buyer: address, producer: address, listing_id: u64) acquires Escrow {
        let paddr = signer::address_of(platform);
        assert!(exists<Escrow>(paddr), 4);
        let escrow_ref = borrow_global_mut<Escrow>(paddr);

        // find pending trade
        let len = vector::length(&escrow_ref.trades);
        let mut i = 0;
        let mut found = false;
        let mut amt = 0;
        while (i < len) {
            let t = *vector::borrow(&escrow_ref.trades, i);
            if (t.listing_id == listing_id && t.buyer == buyer && t.producer == producer) {
                amt = t.amount;
                found = true;
                break;
            }
            i = i + 1;
        }
        assert!(found, 5);

        // remove pending trade
        vector::swap_remove(&mut escrow_ref.trades, i);

        // refund platform -> buyer
        let payment = coin::withdraw<AptosCoin>(platform, amt);
        coin::deposit<AptosCoin>(buyer, payment);
    }

    /// Helper to read number of pending trades (off-chain clients should use get_account_resources)
    public fun pending_count(platform_addr: address): u64 acquires Escrow {
        if (!exists<Escrow>(platform_addr)) {
            return 0;
        };
        let escrow_ref = borrow_global<Escrow>(platform_addr);
        vector::length(&escrow_ref.trades)
    }
}
