interface Lazy<G1, G2> {
    load (options: G1): G2
}