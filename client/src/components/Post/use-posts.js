import { useEffect, useState } from "react";
import { ConsultationsService } from "../../services/consultations-service";

const cache = {};

export default function usePosts(uid, { listen } = { listen: true }) {
  const cached = cache[uid];
  const [posts, setPosts] = useState(cached);
  useEffect(() => {
    const consultationsService = new ConsultationsService();

    async function fetchConsultations() {
      try {
        const { data: consultations } = await consultationsService.getAll();
        cache[uid] = consultations;
        setPosts(consultations);
      } catch (err) {
        console.error(err);
      }
    }

    if (listen) {
      fetchConsultations();
    }
  }, [uid, listen]);
  return posts;
}

export async function preloadPosts(uid) {
  const consultationsService = new ConsultationsService();
  const { data: consultations } = await consultationsService.getAll();
  cache[uid] = consultations;
  return;
}
